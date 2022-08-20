import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const SimpleMap = (props) => {
    const [center, setCenter] = useState({lat: 20.0, lng: 10.0 });
    const [zoom, setZoom] = useState(2.5);
    return (
        <div style={{ height: '94vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY }}
          defaultCenter={center}
          defaultZoom={zoom}
          options={{
            minZoomOverride: true,
            minZoom: 2.5,
          }}
        >
        </GoogleMapReact>
      </div>
    );
}

export default SimpleMap;