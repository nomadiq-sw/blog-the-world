import {ControlledMenu, MenuItem} from '@szhsin/react-menu'
import {useMenuState} from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/core.css'
import {menuSelector, menuItemSelector} from '@szhsin/react-menu/style-utils'
import styled from 'styled-components'

const Menu = styled(ControlledMenu)`
  ${menuSelector.name} {
    background: rgba(40, 40, 40, 0.9);
		color: white;
		font: 14px Arial, sans-serif;
    user-select: none;
    border-radius: 6px;
    width: 6rem;
    text-align: start;
  }

  ${menuItemSelector.name} {
    border-radius: 6px;
    padding: 0.375rem 0.625rem;
  }

  ${menuItemSelector.hover} {
    background-color: var(--bs-primary);
  }
`

const NewPostMenu = ({state, edit, handleEditClick, handleDeleteClick}) => {
  const [menuProps, toggleMenu] = useMenuState()
	const authTokenIsAbsent = () => localStorage.getItem('token') === null

	toggleMenu(state)

	const confirmDelete = (event) => {
		if (window.confirm("Are you sure you want to delete this post?"))
		{
			toggleMenu(false)
			handleDeleteClick()
		}
	}

	// noinspection JSValidateTypes
	return (
    <Menu {...menuProps} aria-label='Add or edit a post' onClose={() => toggleMenu(false)}>
	    <MenuItem disabled={authTokenIsAbsent()}
	              onClick={() => {toggleMenu(false); handleEditClick()}}
	              aria-label={edit ? 'Edit post' : 'Add post'}>
		    {edit ? 'Edit' : 'Add'} post
			</MenuItem>
	    {edit ?
		    <MenuItem disabled={authTokenIsAbsent()}
		              onClick={confirmDelete}
		              aria-label={'Delete post'}>
			    Delete post
		    </MenuItem> : null
			}
    </Menu>
	)
}

export default NewPostMenu
