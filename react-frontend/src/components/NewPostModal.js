import React, {useEffect, useState} from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {Language, Traveler} from '../constants/enums'

const NewPostModal = ({modalShow, postId, initLat, initLng}) => {
	const [show, setShow] = useState(false)
	const [post, setPost] = useState({})
	const [errorShow, setErrorShow] = useState(false)
	const [errorContent, setErrorContent] = useState("")
	const [successShow, setSuccessShow] = useState(false)
	const [successContent, setSuccessContent] = useState("")

	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [language, setLanguage] = useState(Language.EN)
	const [traveler, setTraveler] = useState(Traveler.Couple)

	const defaultPost = {
		title: '',
		url: '',
		language: Language.EN,
		traveler: Traveler.Couple,
		trip: [],
		latitude: initLat,
		longitude: initLng,
	}

	useEffect(() => {
		if (modalShow > 0) {
			handleMenuClick()
		}
	}, [modalShow])

	useEffect(() => {
		setTitle(post.title)
		setUrl(post.url)
		setLanguage(post.language)
	}, [post])

	const handleMenuClick = () => {
		if (postId !== 0) {
			axios.get(process.env.REACT_APP_FLASK_API_URL + '/posts/' + postId).then(
				(response) => {
					setPost(response.data)
				}
			).then(() => {setShow(true)})
		} else {
			setPost(defaultPost)
			setShow(true)
		}
	}

	const handleClose = () => {
		setPost(defaultPost)
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
					<Form.Group>
						<Form.Label>URL</Form.Label>
						<Form.Control type='url' defaultValue={post.url} onChange={(e) => setUrl(e.target.value)}/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Language</Form.Label>
						<Form.Select defaultValue={post.language} onChange={(e) => setLanguage(e.target.value)}>
							<option value={Language.AR}>Arabic</option>
							<option value={Language.ZH}>Chinese</option>
							<option value={Language.NL}>Dutch</option>
							<option value={Language.EN}>English</option>
							<option value={Language.FR}>French</option>
							<option value={Language.DE}>German</option>
							<option value={Language.IT}>Italian</option>
							<option value={Language.JP}>Japanese</option>
							<option value={Language.FA}>Persian</option>
							<option value={Language.PL}>Polish</option>
							<option value={Language.PT}>Portuguese</option>
							<option value={Language.RU}>Russian</option>
							<option value={Language.ES}>Spanish</option>
							<option value={Language.TR}>Turkish</option>
							<option value={Language.VI}>Vietnamese</option>
						</Form.Select>
					</Form.Group>
					<Form.Group>
						<Form.Label>Traveler type</Form.Label>
						<Form.Select defaultValue={post.traveler} onChange={(e) => setTraveler(e.target.value)}>
							<option value={Traveler.Couple}>Couple</option>
							<option value={Traveler.Family}>Family</option>
							<option value={Traveler.Group}>Group</option>
							<option value={Traveler.Solo}>Solo</option>
						</Form.Select>
					</Form.Group>
					<Button className="mt-3" type="submit">Submit</Button>
				</Form>
			</Modal.Body>
		</Modal>
	)
}

export default NewPostModal
