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

import { render, screen } from '@testing-library/react'
import App from './App'

test('renders site header', () => {
	render(<App />)
	const titleElement = screen.getByText(/#BTW/i)
	expect(titleElement).toBeInTheDocument()
})

test('renders map', () => {
	render(<App />)
	const mapElement = screen.getByTestId('google-map-react')
	expect(mapElement).toBeVisible()
})
