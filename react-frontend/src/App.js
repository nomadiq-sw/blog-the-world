import SimpleMap from './components/SimpleMap'
import LoginSidebar from './components/LoginSidebar'
import {Outlet} from 'react-router-dom'
import './App.css'

const App = () => {

	return (
		<div className='App'>
			<header className='App-header'>
				<h1 style={{fontSize:36, paddingLeft:'8px', color:'white'}}>#BTW</h1>
				<LoginSidebar placement='end'/>
			</header>
			<div className='map-container' style={{ height: '94vh', width: '100%' }}>
				<Outlet/>
				<SimpleMap/>
			</div>
		</div>
	)
}

export default App