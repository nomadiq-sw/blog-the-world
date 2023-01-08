import React from 'react'
import styled from 'styled-components'
import PostPopup from './PostPopup'

const Wrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 14px;
	height: 14px;
	opacity: ${(props) => (props.verified ? 1.0 : 0.4)};
	background-color: ${(props) => (props.verified ? 'var(--bs-primary)' : 'var(--bs-secondary)')};
	border: 2px solid #fff;
	border-radius: 100%;
	user-select: none;
	transform: translate(-50%, -50%);
	cursor: ${(props) => (props.onMouseOver ? 'pointer' : 'default')};
	&:hover {
		z-index: 1;
	}
`

const Marker = ({post}) => {

	return (
		<div>
      <Wrapper verified={post.verified} className={'marker' + post.id}/>
			<PostPopup post={post} trigger={<Wrapper className={'marker' + post.id}/>}/>
		</div>
	)
}

export default Marker
