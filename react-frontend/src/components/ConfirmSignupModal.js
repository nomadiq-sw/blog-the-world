import React, {useState, useEffect} from 'react'
import {
	Alert,
	Button,
	Modal,
	ModalBody,
} from 'react-bootstrap'
import axios from 'axios'
import {useLoaderData, useNavigate} from 'react-router-dom'

export async function loader({ params }) {
	return params.token
}

const ConfirmSignupModal = () => {
	const [show, setShow] = useState(true)
	const [errorShow, setErrorShow] = useState(false)
	const [errorContent, setErrorContent] = useState("")
	const [successShow, setSuccessShow] = useState(false)
	const [successContent, setSuccessContent] = useState("")
	const token = useLoaderData()
	const navigate = useNavigate()

	useEffect(() => {
		axios.get(process.env.REACT_APP_FLASK_API_URL + "/confirm-signup/" + token).then(
			(response) => {
				console.log(response.status)
				console.log(response.data)
				if (response.status === 200) {
					setSuccessContent(response.data.message)
					setErrorShow(false)
					setSuccessShow(true)
				}
			}
		).catch(
			(error) => {
				if (error.response) {
					console.log(error.response.status)
					console.log(error.response.data)
					setErrorContent(error.response.data.message)
					setSuccessShow(false)
					setErrorShow(true)
				}
			}
		)
	}, [token])

	const handleClose = () => {
		setErrorShow(false)
		setSuccessShow(false)
		setShow(false)
		navigate("/")
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<ModalBody>
				<Alert show={errorShow} variant='danger'>
					{errorContent}
				</Alert>
				<Alert show={successShow} variant='success'>
					{successContent}
				</Alert>
				<Button type="button" onClick={handleClose}>OK</Button>
			</ModalBody>
		</Modal>
	)
}

export default ConfirmSignupModal
