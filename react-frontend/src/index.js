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

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom'
import './index.css'
import App from './App'
import PageLayout from './PageLayout'
import PasswordResetModal, {loader as resetTokenLoader} from './components/PasswordResetModal'
import ConfirmSignupModal, {loader as signupTokenLoader} from './components/ConfirmSignupModal'
import TermsConditionsPage from './components/TermsConditionsPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
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
			},
		]
	},
	{
		element: <PageLayout/>,
		children: [
			{
				path: 'terms-conditions',
				element: <TermsConditionsPage/>
			},
			{
				path: 'privacy-policy',
				element: <PrivacyPolicyPage/>
			},
		]
	},
])

const recaptcha_script = document.createElement('script')
recaptcha_script.src =
	`https://www.google.com/recaptcha/api.js?badge=bottomleft&render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`
recaptcha_script.id = 'recaptcha_script'
document.head.appendChild(recaptcha_script)

const root = ReactDOM.createRoot(document.getElementById('root'))

document.getElementById('recaptcha_script').addEventListener(
	'load',
	() => {
		root.render(
			//  <React.StrictMode>
			<RouterProvider router={router}/>
			//  </React.StrictMode>
		)
		console.log("env = " + process.env.NODE_ENV)
	}
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
