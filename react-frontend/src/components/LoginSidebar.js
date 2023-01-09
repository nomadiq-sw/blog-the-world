import React, {useState, useRef} from 'react'
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  InputGroup,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  OffcanvasBody,
} from 'react-bootstrap'
import axios from 'axios'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'
import useToken from '../utilities/useToken'
import validateRecaptcha from '../utilities/validateRecaptcha'

const LoginSidebar = (props) => {
  const [show, setShow] = useState(false)
  const [errorShow, setErrorShow] = useState(false)
  const [errorContent, setErrorContent] = useState("")
  const [successShow, setSuccessShow] = useState(false)
  const [successContent, setSuccessContent] = useState("")
  const [passwordShow, setPasswordShow] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const [formDisabled, setFormDisabled] = useState(false)
  const formRef = useRef()
  const emailRef = useRef()
  const validFormRef = useRef(false)
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
    else { setShow(true) }
  }

  const handleLogOut = () => {
    removeToken()
    setLoggedIn(false)
  }

  const validateForm = (event) => {
    event.preventDefault()
    setErrorShow(false)
    setSuccessShow(false)
    const form = formRef.current
    validFormRef.current = form.checkValidity()
    form.reportValidity()
  }

  const clearForm = (event) => {
    setLoginForm(({
      email: loginForm.email,
      password: ""
    }))
    event.preventDefault()
  }

  const postDataAndTreatResponse = async (url, data, successCallback) => {
    return validateRecaptcha(validFormRef).then((recaptchaValid) => {
      if (recaptchaValid) {
        axios.post(url, data).then((response) => {
          console.log(response.status)
          console.log(response.data)
          successCallback(response)
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
      else {
        setErrorContent("Unable to confirm that you are not a robot. Please try again.")
        setSuccessShow(false)
        setErrorShow(true)
      }
    }).catch(
      (error) => {
        console.log(error)
        setErrorContent("Unable to process recaptcha token. Please try again later.")
        setSuccessShow(false)
        setErrorShow(true)
      }
    )
  }

  const logIn = async (event) => {
    validateForm(event)
    if (validFormRef.current) {
      setFormDisabled(true)
      await postDataAndTreatResponse(
        process.env.REACT_APP_FLASK_API_URL + "/login",
        {
          email: loginForm.email,
          password: loginForm.password
        },
        (response) =>
        {
          setToken(response.data.access_token)
          if (getToken) {
            setLoggedIn(true)
            handleClose()
          }
        }
      )
      setFormDisabled(false)
      clearForm(event)
    }
  }

  const registerUser = async (event) => {
    validateForm(event)
    if (validFormRef.current) {
      setFormDisabled(true)
      await postDataAndTreatResponse(
        process.env.REACT_APP_FLASK_API_URL + "/signup",
        {
          email: loginForm.email,
          password: loginForm.password
        },
        (response) => {
          setSuccessContent(response.data.message)
          setErrorShow(false)
          setSuccessShow(true)
        }
      )
      setFormDisabled(false)
      clearForm(event)
    }
  }

  const handleForgottenPassword = async (event) => {
    const input = emailRef.current
    validFormRef.current = input.checkValidity()
    input.reportValidity()
    if (validFormRef.current) {
      setFormDisabled(true)
      await postDataAndTreatResponse(
        process.env.REACT_APP_FLASK_API_URL + "/forgotten-password",
        {
          email: loginForm.email
        },
        (response) => {
          setSuccessContent(response.data.message)
          setErrorShow(false)
          setSuccessShow(true)
        }
      )
      setFormDisabled(false)
      clearForm(event)
    }
  }

  const handleChange = (event) => {
    const {value, name} = event.target
    setLoginForm(prevNote => ({
      ...prevNote, [name]: value
    }))
  }

  const togglePasswordShow = () => {
    setPasswordShow(!passwordShow)
  }

  return (
    <div>
      <Button variant="primary" onClick={handleShow} className="btn-sm me-2">
        {loggedIn? 'Log out' : 'Log in'}
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>Log in or Register</OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
          <Alert show={errorShow} variant='danger'>
            {errorContent}
          </Alert>
          <Alert show={successShow} variant='success'>
            {successContent}
          </Alert>
          <Form ref={formRef} onSubmit={logIn}>
            <FormGroup className="mb-2" controlId='formGroupEmail'>
              <FormLabel>E-mail address</FormLabel>
              <FormControl onChange={handleChange}
                           disabled={formDisabled}
                           ref={emailRef}
                           required
                           type="email"
                           name="email"
                           placeholder="E-mail"
                           value={loginForm.email}/>
            </FormGroup>
            <FormGroup className="mb-2" controlId='formGroupPassword'>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <FormControl onChange={handleChange}
                             disabled={formDisabled}
                             required
                             minLength="8"
                             type={passwordShow ? "text" : "password"}
                             name="password"
                             placeholder="Password"
                             value={loginForm.password}/>
                <Button variant='outline-secondary' onClick={togglePasswordShow}>
                  {passwordShow ? <AiFillEyeInvisible/> : <AiFillEye/>}
                </Button>
              </InputGroup>
            </FormGroup>
            <span className="text-black-50">
              By registering, you accept the&nbsp;
                <a href='/terms-conditions' target='_blank'>
                  terms & conditions
                </a>
              &nbsp;and&nbsp;
                <a href='/privacy-policy' target='_blank'>
                  privacy policy
                </a>
            </span><br className="mb-2"/>
            <div className="container g-0">
              <div className="row justify-content-start g-0">
                <div className="col-3 pe-2">
                  <Button type="submit"
                          disabled={formDisabled}
                          className="g-recaptcha w-100">
                    Log in
                  </Button>
                </div>
                <div className="col-3 pb-2">
                  <Button type="button"
                          disabled={formDisabled}
                          className="g-recaptcha w-100 btn-secondary"
                          onClick={registerUser}>
                    Register
                  </Button>
                </div>
              </div>
              <div className="row justify-content-start g-0">
                <div className="col-6">
                  <Button type="button"
                          disabled={formDisabled}
                          className="g-recaptcha w-100 btn-light"
                          onClick={handleForgottenPassword}>
                    <span className="text-black-50">I forgot my password</span>
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  )
}

export default LoginSidebar
