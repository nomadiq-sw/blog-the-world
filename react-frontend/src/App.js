import './App.css';
import SimpleMap from './components/SimpleMap';
import axios from 'axios';
import {useEffect, useState} from 'react';

function App() {
	const [places, setPlaces] = useState([])

	useEffect(() => {
		axios.get("http://127.0.0.1:5000/markers").then(
				(response) => {
					setPlaces(response.data)
				}
		).catch(
				(err) => {
					return `Error: ${err.message}`
				}
		)
	}, [])

	if (!places || places.length === 0) { return null }

	return (
		<div className="App">
			<header className="App-header">
				<h1>#BTW</h1>
			</header>
			<div>
				<SimpleMap pins={places} className="Google-map"/>
			</div>
		</div>
	);
}

export default App