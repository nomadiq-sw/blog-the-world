import axios from 'axios'
import {useEffect, useState} from 'react'
import SimpleMap from './components/SimpleMap'
import LoginSidebar from './components/LoginSidebar'
import {Outlet} from 'react-router-dom'
import './App.css'

const App = () => {
	const [posts, setPosts] = useState([])

	useEffect(() => {
		axios.get(process.env.REACT_APP_FLASK_API_URL+"/posts").then(
				(response) => {
					setPosts(response.data)
				}
		).catch(
				(err) => {
					return `Error: ${err.message}`
				}
		)
	}, [])

	if (!posts) { return null }

	return (
		<div className='App'>
			<header className='App-header'>
				<h1 style={{fontSize:36, paddingLeft:'8px', color:'white'}}>#BTW</h1>
				<LoginSidebar placement='end'/>
			</header>
			<div className='map-container' style={{ height: '94vh', width: '100%' }}>
				<Outlet/>
				<SimpleMap pins={posts}/>
			</div>
		</div>
	)
}

export default App