import { useState, useEffect, useCallback } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'
import NewPostMenu from "./NewPostMenu"

const SimpleMap = (props) => {
	const [center, setCenter] = useState({lat: 20.0, lng: 10.0 })
	const [zoom, setZoom] = useState(2.5)
	const [menuState, setMenuState] = useState(false)
	const [menuAnchor, setMenuAnchor] = useState({x: 0, y: 0})

	const handleContextMenu = useCallback((e) => {
			e.preventDefault()
			setMenuAnchor({x: e.x, y: e.y})
			setMenuState(true)
		},
		[setMenuState, setMenuAnchor]
	)

  useEffect(() => {
	  document.addEventListener("contextmenu", handleContextMenu)
	  return () => {
		  document.removeEventListener("contextmenu", handleContextMenu)
	  }
  })

	return (
		<GoogleMapReact
			data-testid='google-map-react'
			bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY }}
			defaultCenter={center}
			defaultZoom={zoom}
			yesIWantToUseGoogleMapApiInternals
			options={{
				minZoomOverride: true,
				minZoom: 2.5,
				fullscreenControl: false,
			}}
			onChange = {({center, zoom, bounds, ...other}) => {setMenuState(false)}}
			onClick={() => {setMenuState(false)}}
		>
			<NewPostMenu state={menuState} anchor={menuAnchor}/>
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