import { useState } from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'

const SimpleMap = (props) => {
	const [center, setCenter] = useState({lat: 20.0, lng: 10.0 })
	const [zoom, setZoom] = useState(2.5)
	return (
		<div className={'googleMap'} data-testid='google-map-react' style={{ height: '94vh', width: '100%' }}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY }}
				defaultCenter={center}
				defaultZoom={zoom}
				options={{
					minZoomOverride: true,
					minZoom: 2.5,
					fullscreenControl: false,
				}}
			>
				{props.pins.map((post) => (
					<Marker
						key={post.id}
						post={post}
						lat={post.latitude}
						lng={post.longitude}
					/>
				))}
			</GoogleMapReact>
		</div>
	)
}

export default SimpleMap