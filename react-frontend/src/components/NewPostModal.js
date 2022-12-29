import React, {useEffect, useState} from 'react'
import {
	Alert,
	Button,
	Col,
	Row,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
	FormSelect,
	FormCheck,
	Modal,
	ModalHeader,
	ModalTitle,
	ModalBody,
} from 'react-bootstrap'
import axios from 'axios'
import {Language, Traveler, Trip} from '../utilities/enums'
import useToken from '../utilities/useToken'
import validateRecaptcha from '../utilities/validateRecaptcha'

const NewPostModal = ({modalShow, postId, initLat, initLng}) => {
	const [show, setShow] = useState(false)
	const [post, setPost] = useState({})
	const [errorShow, setErrorShow] = useState(false)
	const [errorContent, setErrorContent] = useState('')
	const [successShow, setSuccessShow] = useState(false)
	const [successContent, setSuccessContent] = useState('')

	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [language, setLanguage] = useState(Language.EN)
	const [traveler, setTraveler] = useState('')
	const [trip, setTrip] = useState([])
	const tripCheckboxStatus = new Map(Object.keys(Trip).map((key) => [key, false]))
	const [tripCheckboxState, setTripCheckboxState] = useState(tripCheckboxStatus)
	const [latitude, setLatitude] = useState(0)
	const [longitude, setLongitude] = useState(0)

	const defaultPost = {
		title: '',
		url: '',
		language: Language.EN,
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

	useEffect(() => {
		setTitle(post.title)
		setUrl(post.url)
		setLanguage(post.language)
		setTraveler(post.traveler)
		let newTrip = trip
		if (post.trip) { newTrip = post.trip.map((x) => x) }
		setTrip(newTrip)
		setLatitude(post.latitude)
		setLongitude(post.longitude)
	}, [post])

	useEffect(() => {
		for (const [key, val] of Object.entries(Trip)) {
			if (trip.includes(val)) {
				tripCheckboxStatus.set(key, true)
			}
		}
		setTripCheckboxState(tripCheckboxStatus)
	}, [trip])

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

	const handleCoordinatesChanged = (event) => {
		let {name, value, min, max} = event.target
		value = Math.max(parseFloat(min), Math.min(parseFloat(value), parseFloat(max)))
		if (name === 'latitudeControl') { setLatitude(value) }
		else { setLongitude(value) }
	}

	const optionRows = (obj) => {
		let rows = []
		for (const [key, value] of
			Object.entries(obj).sort((a, b) => a[1].localeCompare(b[1]))
		) {
			rows.push(<option key={key}>{value}</option>)
		}
		return rows
	}

	const optionChecks = (obj, checkboxState, checkHandler) => {
		let checks = []
		for (const [key, value] of
			Object.entries(obj).sort((a, b) => a[1].localeCompare(b[1]))
		) {
			checks.push(
				<FormGroup as={Col}>
					<FormCheck type='checkbox'
					           key={key}
					           name={value}
					           label={value}
					           checked={checkboxState.get(key)}
					           onChange={checkHandler}/>
				</FormGroup>
			)
		}
		return checks
	}

	const tripTypeCheckHandler = (event) => {
		if (event.target.checked === false) {
			let newTrip = []
			trip.forEach(value => {
				if (value !== event.target.name) {
					newTrip.push(value)
				}
			})
			console.log("Setting trip to", newTrip)
			setTrip(newTrip)
		}
		else if (!trip.includes(event.target.value)) {
			let newTrip = trip.map((x) => x)
			newTrip.push(event.target.name)
			console.log("Setting trip to", newTrip)
			setTrip(newTrip)
		}
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<ModalHeader closeButton>
				<ModalTitle>Enter post details</ModalTitle>
			</ModalHeader>
			<ModalBody>
        <Alert show={errorShow} variant='danger'>
          {errorContent}
        </Alert>
        <Alert show={successShow} variant='success'>
          {successContent}
        </Alert>
				<Form onSubmit={handleSubmit}>
					<FormGroup className='mb-2' controlId='formGroupPostTitle'>
						<FormLabel className='fw-semibold'>Title*</FormLabel>
						<FormControl type='text'
						             required maxLength='180'
						             defaultValue={post.title}
						             onChange={(e) => setTitle(e.target.value)}/>
					</FormGroup>
					<FormGroup className='mb-2' controlId='formGroupPostURL'>
						<FormLabel className='fw-semibold'>URL*</FormLabel>
						<FormControl type='url'
						             required maxLength='2048'
						             defaultValue={post.url}
						             onChange={(e) => setUrl(e.target.value)}/>
					</FormGroup>
					<FormGroup className='mb-2' controlId='formGroupPostLanguage'>
						<FormLabel className='fw-semibold'>Language</FormLabel>
						<FormSelect defaultValue={post.language}
						            onChange={(e) => setLanguage(e.target.value)}>
							{optionRows(Language)}
						</FormSelect>
					</FormGroup>
					<FormGroup className='mb-2' controlId='formGroupTravelerType'>
						<FormLabel className='fw-semibold'>Traveler type</FormLabel>
						<FormSelect defaultValue={post.traveler}
						            onChange={(e) => setTraveler(e.target.value)}>
							<option key=''></option>
							{optionRows(Traveler)}
						</FormSelect>
					</FormGroup>
					<FormGroup className='mb-2' controlId='formGroupTrip'>
						<FormLabel className='fw-semibold'>Trip type</FormLabel>
						<Row>
							{optionChecks(Trip, tripCheckboxState, tripTypeCheckHandler).slice(0, 3)}
						</Row>
						<Row>
							{optionChecks(Trip, tripCheckboxState, tripTypeCheckHandler).slice(3, 6)}
						</Row>
						<Row>
							{optionChecks(Trip, tripCheckboxState, tripTypeCheckHandler).slice(6, 9)}
						</Row>
						<Row>
							{optionChecks(Trip, tripCheckboxState, tripTypeCheckHandler).slice(9,11)}
							<FormGroup as={Col}/> {/* Empty FormGroup for padding */}
						</Row>
					</FormGroup>
					<Row>
						<FormGroup as={Col} controlId='formGroupLatitude'>
							<FormLabel className='fw-semibold'>Latitude*</FormLabel>
							<FormControl name='latitudeControl'
							             type='number' step='0.00001'
							             min='-85.0' max='85.0'
							             required
							             defaultValue={post.latitude}
							             onChange={handleCoordinatesChanged}>
							</FormControl>
						</FormGroup>
						<FormGroup as={Col} controlId='formGroupLongitude'>
							<FormLabel className='fw-semibold'>Longitude*</FormLabel>
							<FormControl name='longitudeControl'
							             type='number' step='0.00001'
							             min='-179.99999' max='180.0'
							             required
							             defaultValue={post.longitude}
							             onChange={handleCoordinatesChanged}>
							</FormControl>
						</FormGroup>
					</Row>
					<Button className="mt-3" type="submit">Submit</Button>
				</Form>
			</ModalBody>
		</Modal>
	)
}

export default NewPostModal