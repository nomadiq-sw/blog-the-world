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
