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

import SimpleMap from './components/SimpleMap'
import LoginSidebar from './components/LoginSidebar'
import {Outlet} from 'react-router-dom'
import './App.css'
import SplashScreenModal from './components/SplashScreenModal'

const App = () => {

	return (
		<div className='App'>
			<header className='App-header'>
				<h1 style={{ fontSize:36, paddingLeft:'8px', paddingTop:'4px', color:'white' }}>#BTW</h1>
				<LoginSidebar placement='end'/>
			</header>
			<div className='map-container' style={{ height: '94vh', width: '100%' }}>
				{localStorage.getItem('splashScreenDismissed') ? null : <SplashScreenModal/>}
				<Outlet/>
				<SimpleMap/>
			</div>
		</div>
	)
}

export default App