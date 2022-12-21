import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App'
import PasswordResetModal, {loader as resetTokenLoader} from './components/PasswordResetModal'
import ConfirmSignupModal, {loader as signupTokenLoader} from './components/ConfirmSignupModal'
import reportWebVitals from './reportWebVitals'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

const router = createBrowserRouter([
	{
		path: "/",
		element: <App/>,
		children: [
			{
				path: "reset-password/:token",
				element: <PasswordResetModal/>,
				loader: resetTokenLoader
			},
			{
				path: "confirm-signup/:token",
				element: <ConfirmSignupModal/>,
				loader: signupTokenLoader
			}
		]
	}
])

const script = document.createElement('script')
script.src =
	`https://www.google.com/recaptcha/api.js?badge=bottomleft&render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`
script.id = 'recaptcha_script'
document.head.appendChild(script)

const root = ReactDOM.createRoot(document.getElementById('root'))

document.getElementById('recaptcha_script').addEventListener(
	'load',
	() => {root.render(
	//  <React.StrictMode>
		<RouterProvider router={router}/>
	//  </React.StrictMode>
	)}
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
