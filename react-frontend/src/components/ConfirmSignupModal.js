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
		axios.patch(process.env.REACT_APP_FLASK_API_URL + "/confirm-signup/" + token).then(
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
