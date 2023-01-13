// Copyright 2023 Owen M. Jones. All rights reserved.
//
// This file is part of BlogTheWorld.
//
// BlogTheWorld is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// BlogTheWorld is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with BlogTheWorld. If not, see <https://www.gnu.org/licenses/>.

import React, {useState, useRef} from 'react'
import {
	Alert,
	Button,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
	InputGroup,
	Modal,
	ModalHeader,
	ModalTitle,
	ModalBody,
} from 'react-bootstrap'
import axios from 'axios'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'
import {useLoaderData, useNavigate} from 'react-router-dom'

export async function loader({ params }) {
	return params.token
}

const PasswordResetModal = () => {
	const [show, setShow] = useState(true)
	const [errorShow, setErrorShow] = useState(false)
	const [errorContent, setErrorContent] = useState("")
	const [successShow, setSuccessShow] = useState(false)
	const [successContent, setSuccessContent] = useState("")
  const [passwordShow, setPasswordShow] = useState(false)
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
			axios.post(
				process.env.REACT_APP_FLASK_API_URL + "/reset-password/" + token,
				{
					'new_password': resetForm.password
				}
			).then((response) => {
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

	const togglePasswordShow = () => {
		setPasswordShow(!passwordShow)
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<ModalHeader closeButton>
				<ModalTitle>Choose a new password</ModalTitle>
			</ModalHeader>
			<ModalBody>
        <Alert show={errorShow} variant='danger'>
          {errorContent}
        </Alert>
        <Alert show={successShow} variant='success'>
          {successContent}
        </Alert>
				<Form onSubmit={handlePasswordReset}>
					<FormGroup controlId='formControlNewPassword'>
						<FormLabel>
							New password
						</FormLabel>
						<InputGroup>
							<FormControl onChange={handleChange}
							             ref={passwordRef}
							             required
							             minLength="8"
							             type={passwordShow ? "text" : "password"}
							             name="password"
							             placeholder="Password"
							             value={resetForm.password}/>
                <Button variant='outline-secondary' onClick={togglePasswordShow}>
                  {passwordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}
                </Button>
						</InputGroup>
					</FormGroup>
					<Button className="mt-3" type="submit">Submit</Button>
				</Form>
			</ModalBody>
		</Modal>
	)
}

export default PasswordResetModal
