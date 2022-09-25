import React from 'react'
import styled from 'styled-components'
import PostPopup from "./PostPopup"

const Wrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 14px;
	height: 14px;
	background-color: var(--bs-primary);
	border: 2px solid #fff;
	border-radius: 100%;
	user-select: none;
	transform: translate(-50%, -50%);
	cursor: ${(props) => (props.onMouseoOver ? 'pointer' : 'default')};
	&:hover {
		z-index: 1;
	}
`

const Marker = ({post}) => {

	return (
		<div>
      <Wrapper className={'marker' + post.id}/>
			<PostPopup post={post} trigger={<Wrapper className={'marker' + post.id}/>}/>
		</div>
	)
}

export default Marker
