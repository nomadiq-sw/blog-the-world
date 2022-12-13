import {useState} from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'
import NewPostMenu from './NewPostMenu'
import NewPostModal from './NewPostModal'

const SimpleMap = (props) => {
	const [center, setCenter] = useState({lat: 20.0, lng: 10.0 })
	const [zoom, setZoom] = useState(2.5)
	const [menuState, setMenuState] = useState(false)
	const [menuEditPost, setMenuEditPost] = useState(0)
	const [menuPosition, setMenuPosition] = useState({lat: 20.0, lng: 10.0})
	const [modalShow, setModalShow] = useState(0)

	const handleGoogleApiLoaded = (map, maps) => {
	  maps.event.addListener(map, "contextmenu", function(ev) {
		  let latitude = ev.latLng.lat()
		  let longitude = ev.latLng.lng()
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
			}}
			yesIWantToUseGoogleMapApiInternals
			onGoogleApiLoaded={({map, maps}) => handleGoogleApiLoaded(map, maps)}
			onChange = {({center, zoom, bounds, ...other}) => {setMenuState(false)}}
			onClick={() => {setMenuState(false)}}>
			<NewPostMenu state={menuState}
			             edit={menuEditPost}
			             handleMenuClick={handleNewPostMenuClick}
			             lat={menuPosition.lat}
			             lng={menuPosition.lng}/>
			<NewPostModal modalShow={modalShow} postId={menuEditPost}/>
			{props.pins.map((post) => (
				<Marker
					key={post.id}
					post={post}
					lat={post.latitude}
					lng={post.longitude}
				/>
			))}
		</GoogleMapReact>
	)
}

export default SimpleMap