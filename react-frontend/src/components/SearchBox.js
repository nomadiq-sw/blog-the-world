import {useRef, useEffect, useCallback} from 'react'
import {Container, FormControl, Row, Col} from 'react-bootstrap'

// This component pillaged from https://stackoverflow.com/a/63279728/7126999 (accessed 2023-01-03)
const SearchBox = ({maps, onPlacesChanged, placeholder}) => {
	const input = useRef(null)
	const searchBox = useRef(null)

	const handleOnPlacesChanged = useCallback(() => {
		console.log("Places changed, handler called")
		if (onPlacesChanged) {
			onPlacesChanged(searchBox.current.getPlaces())
		}
	}, [onPlacesChanged, searchBox])

	useEffect(() => {
		if (!searchBox.current && maps) {
			searchBox.current = new maps.places.SearchBox(input.current)
			console.log("SearchBox ref updated, adding listener")
			searchBox.current.addListener('places_changed', handleOnPlacesChanged)
		}

		return () => {
			if (maps) {
				searchBox.current = null
				maps.event.clearInstanceListeners(searchBox)
			}
		}
	}, [maps, handleOnPlacesChanged])

	return (
		<Container className='m-0'>
			<Row xs={2} lg={3} xl={4}>
				<Col>
					<FormControl ref={input} placeholder={placeholder} type='text'/>
				</Col>
			</Row>
		</Container>
	)
}

export default SearchBox
