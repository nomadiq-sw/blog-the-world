import React, {useEffect, useState} from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'

const NewPostModal = ({modalShow, postId}) => {
	const [show, setShow] = useState(false)
	const [errorShow, setErrorShow] = useState(false)
	const [errorContent, setErrorContent] = useState("")
	const [successShow, setSuccessShow] = useState(false)
	const [successContent, setSuccessContent] = useState("")

	useEffect(() => {
			if (modalShow > 0) {
				handleMenuClick()
			}
		}, [modalShow]
	)

	const handleMenuClick = () => {
		if (postId !== 0) {
			axios.get(process.env.REACT_APP_FLASK_API_URL + '/posts/' + postId).then(
				(response) => {
					console.log("Got title", response.data.title)
				}
			).then(() => {setShow(true)})
		} else {
			console.log("No title")
			setShow(true)
		}
	}

	const handleClose = () => {
		setShow(false)
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Enter post details</Modal.Title>
			</Modal.Header>
			<Modal.Body>
        <Alert show={errorShow} variant='danger'>
          {errorContent}
        </Alert>
        <Alert show={successShow} variant='success'>
          {successContent}
        </Alert>
				<Form onSubmit={(event) => {event.preventDefault()}}>
					<Button className="mt-3" type="submit">Submit</Button>
				</Form>
			</Modal.Body>
		</Modal>
	)
}

export default NewPostModal
