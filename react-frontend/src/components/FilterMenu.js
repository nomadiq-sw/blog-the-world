import {
	Dropdown,
	Form,
	FormGroup,
	FormCheck,
	Button
} from 'react-bootstrap'
import {BsFilterRight} from 'react-icons/bs'
import {Language, Traveler, Trip} from '../utilities/enums'
import {useReducer, useState} from 'react'

const FilterMenu = ({langFilterCallback, travelerFilterCallback, tripFilterCallback}) => {
	const [langAllState, setLangAllState] = useState('All')
	const [travelerAllState, setTravelerAllState] = useState('All')
	const [tripAllState, setTripAllState] = useState('All')
	const langList = Object.entries(Language)
		.sort((a, b) => a[1].localeCompare(b[1]))
	const travelerList = Object.entries(Traveler)
		.sort((a, b) => a[1].localeCompare(b[1]))
	const tripList = Object.entries(Trip)
		.sort((a, b) => a[1].localeCompare(b[1]))

	const reducer = (state, action) => {
		let s = new Map(state)
		switch (action.type) {
			case 'toggle-lang':
				s.set(action.lang, action.payload)
				return s
			case 'toggle-traveler':
				s.set(action.traveler, action.payload)
				return s
			case 'toggle-trip':
				s.set(action.trip, action.payload)
				return s
			default:
				return state
		}
	}

	const [langChecked, langDispatch] = useReducer(
		reducer,
		new Map(Object.keys(Language).map((key) => [key, false]))
	)

	const [travelerChecked, travelerDispatch] = useReducer(
		reducer,
		new Map(Object.keys(Traveler).map((key) => [key, false]))
	)

	const [tripChecked, tripDispatch] = useReducer(
		reducer,
		new Map(Object.keys(Trip).map((key) => [key, false]))
	)

	const langCheckChange = (e) => {
		langDispatch({type: 'toggle-lang', lang: e.target.name, payload: e.target.checked})
	}

	const travelerCheckChange = (e) => {
		travelerDispatch({type: 'toggle-traveler', traveler: e.target.name, payload: e.target.checked})
	}

	const tripCheckChange = (e) => {
		tripDispatch({type: 'toggle-trip', trip: e.target.name, payload: e.target.checked})
	}

	const changeLangAllState = () => {
		for (const [lk, ] of langList) {
			langDispatch({type: 'toggle-lang', lang: lk, payload: (langAllState === 'All')})
		}
		setLangAllState(langAllState === 'All' ? 'None' : 'All')
	}

	const changeTravelerAllState = () => {
		for (const [tvk, ] of travelerList) {
			travelerDispatch({type: 'toggle-traveler', traveler: tvk, payload: (travelerAllState === 'All')})
		}
		setTravelerAllState(travelerAllState === 'All' ? 'None' : 'All')
	}

	const changeTripAllState = () => {
		for (const [trk, ] of tripList) {
			tripDispatch({type: 'toggle-trip', trip: trk, payload: (tripAllState === 'All')})
		}
		setTripAllState(tripAllState === 'All' ? 'None' : 'All')
	}

	const checkRows = (checkList, checkArray, onChangeFunction) => {
		let rows = []
		for (const [key, value] of checkList) {
			rows.push(
					<FormGroup className='mx-3 my-1'>
						<FormCheck type='checkbox'
						           checked={checkArray.get(key)}
						           // This feels so wrong, but it works (ref. https://stackoverflow.com/a/63126124/7126999):
						           key={Math.random()}
						           name={key}
						           label={value}
						           onChange={onChangeFunction}/>
					</FormGroup>
			)
		}
		return (rows)
	}

	return (
		<Dropdown autoClose='outside'>
			<Dropdown.Toggle className='btn-light'>
				<BsFilterRight size={24}/>
			</Dropdown.Toggle>
			<Dropdown.Menu>
				<DropdownCheckboxList label='Language'
				                      checkFunc={checkRows(langList, langChecked, langCheckChange)}
				                      filterCallback={() => {langFilterCallback(langChecked)}}
				                      allStateVar={langAllState}
				                      allStateFunc={changeLangAllState}/>
				<DropdownCheckboxList label='Traveler'
				                      checkFunc={checkRows(travelerList, travelerChecked, travelerCheckChange)}
				                      filterCallback={() => {travelerFilterCallback(travelerChecked)}}
				                      allStateVar={travelerAllState}
				                      allStateFunc={changeTravelerAllState}/>
				<DropdownCheckboxList label='Trip'
				                      checkFunc={checkRows(tripList, tripChecked, tripCheckChange)}
				                      filterCallback={() => {tripFilterCallback(tripChecked)}}
				                      allStateVar={tripAllState}
				                      allStateFunc={changeTripAllState}/>
			</Dropdown.Menu>
		</Dropdown>
	)
}

const DropdownCheckboxList = ({label, checkFunc, filterCallback, allStateVar, allStateFunc}) => {
	return (
		<Dropdown.Item>
			<Dropdown drop='start' autoClose='outside'>
				<Dropdown.Toggle style={{border:'none', background: 'none', color:'#000'}} className='w-100'>
					{label}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Form>
						{checkFunc}
            <div className="container g-0">
              <div className="row justify-content-center g-0">
                <div className="col-5 me-1">
									<Button type='button'
									        className='btn-primary w-100'
									        onClick={filterCallback}>
										Apply
									</Button>
                </div>
	              <div className='col-5'>
									<Button type='button'
									        className='btn-secondary w-100'
									        onClick={allStateFunc}>
										{allStateVar}
									</Button>
	              </div>
              </div>
            </div>
					</Form>
				</Dropdown.Menu>
			</Dropdown>
		</Dropdown.Item>
	)
}

export default FilterMenu