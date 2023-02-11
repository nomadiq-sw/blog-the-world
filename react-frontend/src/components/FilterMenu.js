import {
	Dropdown,
	Form,
	FormGroup,
	FormCheck,
	Button
} from 'react-bootstrap'
import {BsFilterRight} from 'react-icons/bs'
import {Language} from '../utilities/enums'
import {useReducer, useState} from "react";

const FilterMenu = ({langFilterCallback}) => {
	const [langAllState, setLangAllState] = useState('All')
	const langList = Object.entries(Language).sort((a, b) => a[1].localeCompare(b[1]))

	const langReducer = (state, action) => {
		switch (action.type) {
			case 'toggle':
				let s = new Map(state)
				s.set(action.lang, action.payload)
				return s
			default:
				return state
		}
	}

	const [langChecked, langDispatch] = useReducer(
		langReducer,
		new Map(Object.keys(Language).map((key) => [key, false]))
	)

	const langCheckChange = (e) => {
		langDispatch({type: 'toggle', lang: e.target.name, payload: e.target.checked})
	}

	const changeLangAllState = () => {
		for (const [lk, ] of langList) {
			langDispatch({type: 'toggle', lang: lk, payload: (langAllState === 'All')})
		}
		setLangAllState(langAllState === 'All' ? 'None' : 'All')
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
				<Dropdown.Item>
					<Dropdown drop='start' autoClose='outside'>
						<Dropdown.Toggle style={{border:'none', background: 'none', color:'#000'}} className='w-100'>
							Language
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Form>
								{checkRows(langList, langChecked, langCheckChange)}
		            <div className="container g-0">
		              <div className="row justify-content-center g-0">
		                <div className="col-5 me-1">
											<Button type='button'
											        className='btn-primary w-100'
											        onClick={() => langFilterCallback(langChecked)}>
												Apply
											</Button>
		                </div>
			              <div className='col-5'>
											<Button type='button'
											        className='btn-secondary w-100'
											        onClick={changeLangAllState}>
												{langAllState}
											</Button>
			              </div>
		              </div>
		            </div>
							</Form>
						</Dropdown.Menu>
					</Dropdown>
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}

export default FilterMenu