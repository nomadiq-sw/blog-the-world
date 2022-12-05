import React, {useState, useRef} from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {useLoaderData, useNavigate} from 'react-router-dom'

export async function loader({ params }) {
	return params.token
}

const PasswordResetModal = () => {
	const [show, setShow] = useState(true)
	const [errorShow, setErrorShow] = useState(false)
	const [errorContent, setErrorContent] = useState("")
	const [successContent, setSuccessContent] = useState("")
	const [successShow, setSuccessShow] = useState(false)
  const [resetForm, setResetForm] = useState({
    password: ""
  })
	const validRef = useRef(false)
	const passwordRef = useRef()
	const token = useLoaderData()
	const navigate = useNavigate()

	const handleClose = () => {
		setResetForm(({
			password: ""
		}))
		setErrorShow(false)
		setSuccessShow(false)
		setShow(false)
		navigate("/")
	}

	const handlePasswordReset = (event) => {
		event.preventDefault()
		const input = passwordRef.current
		validRef.current = input.checkValidity()
		input.reportValidity()
		if (validRef.current) {
			axios({
				method: "POST",
				url: process.env.REACT_APP_FLASK_API_URL + "/reset-password/" + token,
				data: {
					'new_password': resetForm.password
				}
			}).then((response) => {
        console.log(response.status)
        console.log(response.data)
				if (response.status === 201) {
	        setSuccessContent(response.data.message)
	        setErrorShow(false)
	        setSuccessShow(true)
				}
			}).catch((error) => {
				if (error.response) {
			    console.log(error.response.status)
			    console.log(error.response.data)
			    setErrorContent(error.response.data.message)
			    setSuccessShow(false)
			    setErrorShow(true)
				}
			})
		}
		setResetForm(({
			password: ""
		}))
	}

	const handleChange = (event) => {
    const {value, name} = event.target
    setResetForm(prevNote => ({
      ...prevNote, [name]: value
    }))
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Choose a new password</Modal.Title>
			</Modal.Header>
			<Modal.Body>
        <Alert show={errorShow} variant='danger'>
          {errorContent}
        </Alert>
        <Alert show={successShow} variant='success'>
          {successContent}
        </Alert>
				<Form onSubmit={handlePasswordReset}>
					<Form.Group>
						<Form.Label>
							New password
						</Form.Label>
						<Form.Control onChange={handleChange}
						              ref={passwordRef}
						              required
						              minLength="8"
						              type="password"
						              name="password"
						              placeholder="Password"
						              value={resetForm.password}/>
					</Form.Group>
					<Button className="mt-3" type="submit">Submit</Button>
				</Form>
			</Modal.Body>
		</Modal>
	)
}

export default PasswordResetModal
