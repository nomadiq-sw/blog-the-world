import { useState } from 'react';
import Marker from './Marker';
import GoogleMapReact from 'google-map-react';

const SimpleMap = (props) => {
	const [center, setCenter] = useState({lat: 20.0, lng: 10.0 });
	const [zoom, setZoom] = useState(2.5);
	return (
		<div data-testid='google-map-react' style={{ height: '94vh', width: '100%' }}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY }}
				defaultCenter={center}
				defaultZoom={zoom}
				options={{
					minZoomOverride: true,
					minZoom: 2.5,
				}}
			>
				{props.pins.map((place) => (
					<Marker
						key={place.id}
						text={place.title}
						lat={place.latitude}
						lng={place.longitude}
					/>
				))}
			</GoogleMapReact>
		</div>
	);
}

export default SimpleMap;