import {useState} from 'react'
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
    width: 5rem;
  }

  ${menuItemSelector.name} {
    border-radius: 6px;
    padding: 0.375rem 0.625rem;
  }

  ${menuItemSelector.hover} {
    background-color: var(--bs-primary);
  }
`

const NewPostMenu = ({state, edit}) => {
  const [menuProps, toggleMenu] = useMenuState()

	const authTokenIsAbsent = () => localStorage.getItem('token') === null

	const openNewPostModal = () => {
		console.log("Clicked!")
		toggleMenu(false)
		return null
	}

	toggleMenu(state)

	return (
    <Menu {...menuProps} aria-label='Add or edit a post' onClose={() => toggleMenu(false)}>
	    <MenuItem disabled={authTokenIsAbsent()} onClick={openNewPostModal} aria-label={edit ? 'Edit post' : 'Add post'}>
		    {edit ? 'Edit' : 'Add'} post
			</MenuItem>
    </Menu>
	)
}

export default NewPostMenu