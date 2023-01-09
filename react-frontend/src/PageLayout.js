import './App.css'
import {Outlet} from 'react-router-dom'

const PageLayout = () => {
	return (
		<div className='App'>
			<header className='App-header'>
				<h1 style={{fontSize:36, paddingLeft:'8px', color:'white'}}>#BTW</h1>
			</header>
			<div style={{ paddingBlockStart: '4px' }}>
				<Outlet/>
			</div>
		</div>
	)
}

export default PageLayout
