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
