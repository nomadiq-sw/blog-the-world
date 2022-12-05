import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
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

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
//  <React.StrictMode>
	<RouterProvider router={router}/>
//  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
