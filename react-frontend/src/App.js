import axios from 'axios'
import {useEffect, useState} from 'react'
import SimpleMap from './components/SimpleMap'
import './App.css'

function App() {
	const [posts, setPosts] = useState([])

	useEffect(() => {
		axios.get("http://127.0.0.1:5000/markers").then(
				(response) => {
					setPosts(response.data)
				}
		).catch(
				(err) => {
					return `Error: ${err.message}`
				}
		)
	}, [])

	if (!posts || posts.length === 0) { return null }

	return (
		<div className="App">
			<header className="App-header">
				<h1>#BTW</h1>
			</header>
			<div>
				<SimpleMap pins={posts} className="Google-map"/>
			</div>
		</div>
	)
}

export default App