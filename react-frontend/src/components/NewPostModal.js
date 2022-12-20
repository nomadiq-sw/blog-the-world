import React, {useEffect, useState} from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'

const NewPostModal = ({modalShow, postId, initLat, initLng}) => {
	const [show, setShow] = useState(false)
	const [post, setPost] = useState({})
	const [errorShow, setErrorShow] = useState(false)
	const [errorContent, setErrorContent] = useState("")
	const [successShow, setSuccessShow] = useState(false)
	const [successContent, setSuccessContent] = useState("")

	const [title, setTitle] = useState('')

	const nullPost = {
		title: '',
		url: '',
		language: '',
		traveler: '',
		trip: [],
		latitude: initLat,
		longitude: initLng,
	}

	useEffect(() => {
		if (modalShow > 0) {
			handleMenuClick()
		}
	}, [modalShow])

	const handleMenuClick = () => {
		if (postId !== 0) {
			axios.get(process.env.REACT_APP_FLASK_API_URL + '/posts/' + postId).then(
				(response) => {
					setPost(response.data)
				}
			).then(() => {setShow(true)})
		} else {
			setPost(nullPost)
			setShow(true)
		}
	}

	const deInitPost = () => {
		setPost(nullPost)
		setTitle('')
	}

	const handleClose = () => {
		deInitPost()
		setShow(false)
	}

	const handleSubmit = (event) => {
		event.preventDefault()
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
				<Form onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label>Title</Form.Label>
						<Form.Control type='text' defaultValue={post.title} onChange={(e) => setTitle(e.target.value)}/>
					</Form.Group>
					<Button className="mt-3" type="submit">Submit</Button>
				</Form>
			</Modal.Body>
		</Modal>
	)
}

export default NewPostModal
