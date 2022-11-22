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

const NewPostMenu = ({state}) => {
  const [menuProps, toggleMenu] = useMenuState()

	toggleMenu(state)

	return (
    <Menu {...menuProps} aria-label='Add post' onClose={() => toggleMenu(false)}>
	    <MenuItem>Add post</MenuItem>
    </Menu>
	)
}

export default NewPostMenu