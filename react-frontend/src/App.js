import axios from 'axios'
import {useEffect, useState} from 'react'
import {BrowserRouter} from 'react-router-dom'
import SimpleMap from './components/SimpleMap'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
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
		<BrowserRouter>
			<div className='App'>
				<header className='App-header'>
					<h1 style={{fontSize:36, paddingLeft:'8px', color:'white'}}>#BTW</h1>
					<Sidebar placement='end'/>
				</header>
				<div className='map-container' style={{ height: '94vh', width: '100%' }}>
					<SimpleMap pins={posts}/>
				</div>
			</div>
		</BrowserRouter>
	)
}

export default App