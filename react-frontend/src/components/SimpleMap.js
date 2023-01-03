import {useEffect, useState, useCallback} from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'
import NewPostMenu from './NewPostMenu'
import NewPostModal from './NewPostModal'
import SearchBox from './SearchBox'
import axios from "axios";
import useToken from '../utilities/useToken'

const SimpleMap = () => {
	const [googlemaps, setGooglemaps] = useState()
	const [pins, setPins] = useState([])
	const [center, setCenter] = useState({lat: 20.0, lng: 10.0 })
	const [zoom, setZoom] = useState(2.5)
	const [menuState, setMenuState] = useState(false)
	const [menuEditPost, setMenuEditPost] = useState(0)
	const [menuPosition, setMenuPosition] = useState({lat: 20.0, lng: 10.0})
	const [modalShow, setModalShow] = useState(0)
	const {setToken, getToken, removeToken} = useToken()

	const handleGoogleApiLoaded = (map, maps) => {
	  setGooglemaps(maps)
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

	// This callback pillaged from a comment on https://stackoverflow.com/a/63279728/7126999 (accessed 2023-01-03)
	const handleOnPlacesChanged = useCallback(e => {
		if (e && e[0] && e[0].geometry) {
			const lat = e[0].geometry.location.lat()
			const lng = e[0].geometry.location.lng()
			setCenter({lat, lng})
			setZoom(12)
		}
	}, [])

	const handleNewPostMenuClick = () => {
		setModalShow(modalShow + 1)
	}

	const handleDeletePostClick = () => {
		const token = getToken()
		const headers = {'Authorization': `Bearer ${token}`}
		axios.delete(
			process.env.REACT_APP_FLASK_API_URL + '/delete-post/' + menuEditPost,
			{
				headers: headers
			}
		).then(
			(response) => {handlePostUpdate()}
		).catch((error) => {
			if (error.response) {
				window.alert(error.response.data.message)
			}
		})
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
		<div className='position-relative h-100 w-100'>
			<div style={{zIndex:'9'}} className='position-absolute w-100 top-0 start-0 px-1 py-3'>
				<SearchBox maps={googlemaps}
				           onPlacesChanged={handleOnPlacesChanged}
				           placeholder='Search...'/>
			</div>
			<div style={{zIndex:'1'}} className='position-absolute w-100 h-100'>
				<GoogleMapReact style={{position:'absolute', height:'100%', width:'100%'}}
					data-testid='google-map-react'
					bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY, libraries: 'places' }}
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
						libraries: 'places',
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
			</div>
		</div>
	)
}

export default SimpleMap