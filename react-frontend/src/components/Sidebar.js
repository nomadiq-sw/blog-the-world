import React, { useState } from 'react'
import useToken from './useToken'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import axios from 'axios'


const Sidebar = (props) => {
  const [show, setShow] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const {setToken, getToken, removeToken} = useToken()
  const [loggedIn, setLoggedIn] = useState(getToken)

  const handleClose = () => setShow(false)
  const handleShow = () => {
    if (loggedIn) { handleLogOut() }
    else setShow(true)
  }
  const handleLogOut = () => {
    removeToken()
    setLoggedIn(false)
  }

  function logIn(event) {
    axios({
      method: "POST",
      url: process.env.REACT_APP_FLASK_API_URL+"/login",
      data: {
        email: loginForm.email,
        password: loginForm.password
      }
    }).then((response) => {
      setToken(response.data.access_token)
      if (getToken) {
        setLoggedIn(true)
        handleClose()
      }
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
      }
    })

    setLoginForm(({
      email: "",
      password: ""
    }))

    event.preventDefault()
  }

  function handleChange(event) {
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
          <form className="login">
            <input onChange={handleChange}
                   type="email"
                   name="email"
                   placeholder="E-mail"
                   value={loginForm.email}/>
            <input onChange={handleChange}
                   type="password"
                   name="password"
                   placeholder="Password"
                   value={loginForm.password}/>

          <button onClick={logIn}>Submit</button>
        </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export default Sidebar
