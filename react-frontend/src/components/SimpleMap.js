// Copyright 2023 Owen M. Jones. All rights reserved.
//
// This file is part of BlogTheWorld.
//
// BlogTheWorld is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License
// as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
// BlogTheWorld is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with BlogTheWorld. If not, see <https://www.gnu.org/licenses/>.

import {useEffect, useState, useCallback, useRef} from 'react'
import GoogleMapReact from 'google-map-react'
import Marker from './Marker'
import NewPostMenu from './NewPostMenu'
import NewPostModal from './NewPostModal'
import SearchBox from './SearchBox'
import FilterMenu from './FilterMenu'
import {Language, Traveler, Trip} from '../utilities/enums'
import axios from 'axios'
import useToken from '../utilities/useToken'

const getWidth = () => {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
}

const mapOptionsCreator = (map) => {
	let zoomControlShow = getWidth() > 992
	console.log("zoomControlShow =", zoomControlShow)
	return {
		minZoomOverride: true,
		minZoom: 2.5,
		fullscreenControl: false,
		zoomControl: zoomControlShow,
		restriction: {
			latLngBounds: {
				north: 85,
				south: -85,
				west: -180,
				east: 180
			}
		},
		libraries: 'places',
	}
}

const SimpleMap = () => {
	const [gmap, setGmap] = useState()
	const [googlemaps, setGooglemaps] = useState()
	const [pins, setPins] = useState([])
	const pinsRef = useRef(pins)
	const [langFilter, setLangFilter] = useState()
	const [travelerFilter, setTravelerFilter] = useState()
	const [tripFilter, setTripFilter] = useState()
	const defaultCenter = {lat: 20.0, lng: 10.0}
	const defaultZoom = 2.5
	const [menuState, setMenuState] = useState(false)
	const [menuEditPost, setMenuEditPost] = useState(0)
	const [menuPostVerified, setMenuPostVerified] = useState(false)
	const [menuPosition, setMenuPosition] = useState({lat: 20.0, lng: 10.0})
	const [modalShow, setModalShow] = useState(0)
	const {setToken, getToken, removeToken} = useToken()

	const handleGoogleApiLoaded = (map, maps) => {
		setGmap(map)
	  setGooglemaps(maps)
	  maps.event.addListener(map, "contextmenu", function(ev) {
		  let latitude = parseFloat(ev.latLng.lat().toFixed(5))
		  let longitude = parseFloat(ev.latLng.lng().toFixed(5))
		  let elements = document.querySelectorAll(':hover')
		  let last = elements.item(elements.length-1)
		  let regex = /sc-bczRLJ \w+ marker(\d+)/g
		  let match = regex.exec(last.className)
		  let editId = match ? parseInt(match[1]) : 0
		  if (editId !== 0) {
				let editPin = pinsRef.current.find(item => item.id === editId)
			  setMenuPostVerified(editPin && editPin.verified)
		  }
		  setMenuEditPost(editId)
		  setMenuPosition({lat: latitude, lng: longitude})
			setMenuState(true)
	  })
	}

	// This callback pillaged from a comment on https://stackoverflow.com/a/63279728/7126999 (accessed 2023-01-03)
	const handleOnPlaceChanged = useCallback(e => {
		if (e && e.geometry) {
			const lat = e.geometry.location.lat()
			const lng = e.geometry.location.lng()
			gmap.setCenter({lat, lng})
			gmap.setZoom(10)
		}
	}, [gmap])

	const handlePostMenuEditClick = () => {
		setModalShow(modalShow + 1)
	}

	const handlePostMenuDeleteClick = () => {
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

	const handlePostMenuVerifyClick = () => {
		const token = getToken()
		const headers = {'Authorization': `Bearer ${token}`}
		axios.patch(
			process.env.REACT_APP_FLASK_API_URL + '/verify-post/' + menuEditPost,
			null,
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
					pinsRef.current = response.data
					if (langFilter) {
						langFilterApply(langFilter)
					}
					if (travelerFilter) {
						travelerFilterApply(travelerFilter)
					}
					if (tripFilter) {
						tripFilterApply(tripFilter)
					}
					else {
						console.log("Showing all posts")
						setPins(response.data)
					}
				}
		).catch(
				(err) => {
					return `Error: ${err.message}`
				}
		)
	}

	const intersect = (first = [], ...rest) => {
   rest = rest.map(array => new Set(array))
   return first.filter(e => rest.every(set => set.has(e)))
	}

	const applyAllFilters = (langFilterList, travelerFilterList, tripFilterList) => {
		let langPins, travelerPins, tripPins = []
		let catArray = []
		if (langFilterList) {
			const langKeys = Object.keys(Language).filter((key) => langFilterList.get(key))
			const langVals = langKeys.map(k => Language[k])
			langPins = pinsRef.current.filter(p => langVals.includes(p.language))
			catArray.push(langPins)
		}
		if (travelerFilterList) {
			const travelerKeys = Object.keys(Traveler).filter((key) => travelerFilterList.get(key))
			const travelerVals = travelerKeys.map(k => Traveler[k])
			travelerPins = pinsRef.current.filter(p => travelerVals.includes(p.traveler))
			catArray.push(travelerPins)
		}
		if (tripFilterList) {
			const tripKeys = Object.keys(Trip).filter((key) => tripFilterList.get(key))
			const intersection = (p) => p.trip.filter((t) => tripKeys.includes(t))
			tripPins = pinsRef.current.filter(p => intersection(p).length)
			catArray.push(tripPins)
		}
		const result = intersect(...catArray)
		console.log("Found", result.length, "matching pins")
		setPins(result)
	}

	const langFilterApply = (langFilterList) => {
		setLangFilter(langFilterList)
		applyAllFilters(langFilterList, travelerFilter, tripFilter)
	}

	const travelerFilterApply = (travelerFilterList) => {
		setTravelerFilter(travelerFilterList)
		applyAllFilters(langFilter, travelerFilterList, tripFilter)
	}

	const tripFilterApply = (tripFilterList) => {
		setTripFilter(tripFilterList)
		applyAllFilters(langFilter, travelerFilter, tripFilterList)
	}

	return (
		<div className='position-relative h-100 w-100'>
			<div style={{zIndex:'9'}} className='position-absolute w-auto top-0 start-0 px-1 py-3'>
				<SearchBox maps={googlemaps}
				           onPlaceChanged={handleOnPlaceChanged}
				           placeholder='Find location...'/>
			</div>
			<div style={{zIndex:'9'}} className='position-absolute w-auto top-0 end-0 px-2 py-3'>
				<FilterMenu langFilterCallback={langFilterApply}
				            travelerFilterCallback={travelerFilterApply}
				            tripFilterCallback={tripFilterApply}/>
			</div>
			<div style={{zIndex:'1'}} className='position-absolute w-100 h-100'>
				<GoogleMapReact style={{position:'absolute', height:'100%', width:'100%'}}
					data-testid='google-map-react'
					bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY, libraries: 'places' }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
					options={mapOptionsCreator}
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={({map, maps}) => handleGoogleApiLoaded(map, maps)}
					onChange = {({center, zoom, bounds, ...other}) => {setMenuState(false)}}
					onClick={() => {setMenuState(false)}}>
					<NewPostMenu state={menuState}
					             edit={menuEditPost}
					             postVerified={menuPostVerified}
					             handleEditClick={handlePostMenuEditClick}
					             handleDeleteClick={handlePostMenuDeleteClick}
					             handleVerifyClick={handlePostMenuVerifyClick}
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