import React, {useState, useRef} from 'react'
import useToken from './useToken'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Offcanvas from 'react-bootstrap/Offcanvas'
import axios from 'axios'

const Sidebar = (props) => {
  const [show, setShow] = useState(false)
  const [errorShow, setErrorShow] = useState(false)
  const [errorContent, setErrorContent] = useState("")
  const [successShow, setSuccessShow] = useState(false)
  const [successContent, setSuccessContent] = useState("")
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const formRef = useRef()
  const validRef = useRef(false)
  const {setToken, getToken, removeToken} = useToken()
  const [loggedIn, setLoggedIn] = useState(getToken)

  const handleClose = () => {
    setShow(false)
    setLoginForm(({
      email: "",
      password: ""
    }))
    setErrorShow(false)
    setSuccessShow(false)
  }

  const handleShow = () => {
    if (loggedIn) { handleLogOut() }
    else setShow(true)
  }

  const handleLogOut = () => {
    removeToken()
    setLoggedIn(false)
  }

  const validateForm = (event) => {
    event.preventDefault()
    const form = formRef.current
    validRef.current = form.checkValidity()
    form.reportValidity()
  }

  const handleError = (response) => {
    console.log(response.status)
    console.log(response.data)
    setErrorContent(response.data.message)
    setSuccessShow(false)
    setErrorShow(true)
  }

  const clearForm = (event) => {
    setLoginForm(({
      email: loginForm.email,
      password: ""
    }))
    event.preventDefault()
  }

  const logIn = (event) => {
    validateForm(event)
    if (validRef.current) {
      axios({
        method: "POST",
        url: process.env.REACT_APP_FLASK_API_URL + "/login",
        data: {
          email: loginForm.email,
          password: loginForm.password
        }
      }).then((response) => {
        console.log(response.status)
        console.log(response.data)
        setToken(response.data.access_token)
        if (getToken) {
          setLoggedIn(true)
          handleClose()
        }
      }).catch((error) => {
        if (error.response) {
          handleError(error.response)
        }
      })
      clearForm(event)
    }
  }

  const registerUser = (event) => {
    validateForm(event)
    if (validRef.current) {
      axios({
        method: "POST",
        url: process.env.REACT_APP_FLASK_API_URL + "/signup",
        data: {
          email: loginForm.email,
          password: loginForm.password
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
          handleError(error.response)
        }
      })
      clearForm(event)
    }
  }

  const handleChange = (event) => {
    const {value, name} = event.target
    setLoginForm(prevNote => ({
      ...prevNote, [name]: value
    }))
  }

  return (
    <div>
      <Button variant="primary" onClick={handleShow} className="btn-sm me-2">
        {loggedIn? 'Log out' : 'Log in'}
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Log in or Register</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Alert show={errorShow} variant='danger'>
            {errorContent}
          </Alert>
          <Alert show={successShow} variant='success'>
            {successContent}
          </Alert>
          <Form ref={formRef} onSubmit={logIn}>
            <Form.Group className="mb-2">
              <Form.Label>E-mail address</Form.Label>
              <Form.Control onChange={handleChange}
                            required
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            value={loginForm.email}/>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control onChange={handleChange}
                            required
                            minLength="8"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginForm.password}/>
            </Form.Group>
            <span className="text-black-50">
              By registering, you accept the terms & conditions and privacy policy.
            </span><br className="mb-2"/>
            <Button type="submit" className="w-25 me-2">Log in</Button>
            <Button type="button" className="w-25 btn-secondary" onClick={registerUser}>Register</Button>
          </Form>
          <a href={}>I forgot my password</a>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default Sidebar
