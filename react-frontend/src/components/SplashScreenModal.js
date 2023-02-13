import {
	Alert,
	Button,
	Modal,
	ModalHeader,
	ModalTitle,
	ModalBody,
	ModalFooter
} from 'react-bootstrap'
import React, {useEffect, useState} from 'react'

const SplashScreenModal = () => {
	const [show, setShow] = useState(true)
	const handleClose = () => {
		localStorage.setItem('splashScreenDismissed', 'true')
		setShow(false)
	}

	return (
		<Modal show={show}>
			<ModalHeader className='justify-content-center'>
				<ModalTitle>Welcome to BlogTheWorld!</ModalTitle>
			</ModalHeader>
			<ModalBody>
				#BTW is the one-stop site for the latest travel blogs.<br/><br/>
				Anyone can sign up and add their favourite blog posts to the map (just right click!).
				The blog posts don't have to be your own, so if you find a post you like on someone else's blog,
				don't hesitate to pin it here!<br/><br/>
				<Alert variant='warning' className='justify-content-center'>
					We're trying to provide current information, so please only add blog posts less than 2 years old!
				</Alert>
	      <span style={{ fontStyle:'italic' }}>
	        Check out our&nbsp;
	          <a href='/terms-conditions' target='_blank'>terms & conditions</a>
		      &nbsp;and&nbsp;
	          <a href='/privacy-policy' target='_blank'>privacy policy</a>.
	      </span>
			</ModalBody>
			<ModalFooter className='justify-content-start'>
				<Button onClick={handleClose}>OK</Button>
			</ModalFooter>
		</Modal>
	)
}

export default SplashScreenModal