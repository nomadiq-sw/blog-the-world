import {useEffect, useState} from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'
import NewPostMenu from './NewPostMenu'
import NewPostModal from './NewPostModal'
import axios from "axios";

const SimpleMap = () => {
	const [pins, setPins] = useState([])
	const [center, setCenter] = useState({lat: 20.0, lng: 10.0 })
	const [zoom, setZoom] = useState(2.5)
	const [menuState, setMenuState] = useState(false)
	const [menuEditPost, setMenuEditPost] = useState(0)
	const [menuPosition, setMenuPosition] = useState({lat: 20.0, lng: 10.0})
	const [modalShow, setModalShow] = useState(0)

	const handleGoogleApiLoaded = (map, maps) => {
	  maps.event.addListener(map, "contextmenu", function(ev) {
		  let latitude = parseFloat(ev.latLng.lat().toFixed(5))
		  let longitude = parseFloat(ev.latLng.lng().toFixed(5))
		  let elements = document.querySelectorAll(':hover')
		  let last = elements.item(elements.length-1)
		  let regex = /sc-bczRLJ iQVEig marker(\d+)/g
		  let match = regex.exec(last.className)
		  setMenuEditPost(match ? parseInt(match[1]) : 0)
		  setMenuPosition({lat: latitude, lng: longitude})
			setMenuState(true)
	  })
	}

	const handleNewPostMenuClick = () => {
		setModalShow(modalShow + 1)
	}

	const handleDeletePostClick = () => {
		console.log("Deleting post with ID " + menuEditPost)
	}

	useEffect(() => {
		handlePostUpdate()
	}, [])

	const handlePostUpdate = () => {
		axios.get(process.env.REACT_APP_FLASK_API_URL + "/posts").then(
				(response) => {
					setPins(response.data)
				}
		).catch(
				(err) => {
					return `Error: ${err.message}`
				}
		)
	}

	return (
		<GoogleMapReact
			data-testid='google-map-react'
			bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY }}
			defaultCenter={center}
			defaultZoom={zoom}
			options={{
				minZoomOverride: true,
				minZoom: 2.5,
				fullscreenControl: false,
				restriction: {
					latLngBounds: {
						north: 85,
						south: -85,
						west: -180,
						east: 180
					}
				},
			}}
			yesIWantToUseGoogleMapApiInternals
			onGoogleApiLoaded={({map, maps}) => handleGoogleApiLoaded(map, maps)}
			onChange = {({center, zoom, bounds, ...other}) => {setMenuState(false)}}
			onClick={() => {setMenuState(false)}}>
			<NewPostMenu state={menuState}
			             edit={menuEditPost}
			             handleMenuClick={handleNewPostMenuClick}
			             handleDeleteClick={handleDeletePostClick}
			             lat={menuPosition.lat}
			             lng={menuPosition.lng}/>
			<NewPostModal modalShow={modalShow}
			              postId={menuEditPost}
			              initLat={menuPosition.lat}
			              initLng={menuPosition.lng}
			              handlePostUpdate={handlePostUpdate}/>
			{pins.map((pin) => (
				<Marker
					key={pin.id}
					post={pin}
					lat={pin.latitude}
					lng={pin.longitude}
				/>
			))}
		</GoogleMapReact>
	)
}

export default SimpleMap