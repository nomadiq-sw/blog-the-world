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

import {useRef, useEffect, useCallback} from 'react'
import {Container, FormControl} from 'react-bootstrap'

// This component pillaged from https://stackoverflow.com/a/63279728/7126999 (accessed 2023-01-03)
const SearchBox = ({maps, onPlaceChanged, placeholder}) => {
	const input = useRef(null)
	const searchBox = useRef(null)

	const handleOnPlaceChanged = useCallback(() => {
		if (onPlaceChanged) {
			onPlaceChanged(searchBox.current.getPlace())
		}
	}, [onPlaceChanged, searchBox])

	useEffect(() => {
		if (!searchBox.current && maps) {
			searchBox.current = new maps.places.Autocomplete(input.current, {fields: ['place_id', 'geometry', 'name']})
			searchBox.current.addListener('place_changed', handleOnPlaceChanged)
		}

		return () => {
			if (maps) {
				searchBox.current = null
				maps.event.clearInstanceListeners(searchBox)
			}
		}
	}, [maps, handleOnPlaceChanged])

	return (
		<Container className='m-0'>
			<FormControl className='w-auto' ref={input} placeholder={placeholder} type='text'/>
		</Container>
	)
}

export default SearchBox
