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

import Popup from 'reactjs-popup'

const PostPopup = ({post, trigger}) => {
	const dateString = new Date(post.date).toLocaleDateString()
	const postUrl = new URL(post.url)
	const postBaseUrl = postUrl.origin
	const postDomain = postUrl.hostname.replace('www.', '')

	return (
		<Popup trigger={trigger}
		       offsetY={2}
		       contentStyle={{
						 maxWidth: '300px',
						 color: 'white',
			       font: '14px Arial, sans-serif',
			       background: 'rgba(40, 40, 40, 0.9)',
			       padding: '12px',
			       borderRadius: '6px',
			       lineHeight: '1.5'
		       }}
		       arrowStyle={{color: 'rgba(40, 40, 40, 0.9)'}}
		       on={['hover', 'focus', 'click']}
		       position={['top center', 'top right', 'top left', 'bottom center', 'bottom left', 'bottom right']}
		       keepTooltipInside='.map-container'>
			<div>
				<span>
					<a style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}
					   href={post.url}
					   target='_blank' rel='noopener'>
						{post.title}
					</a>
				</span><br/>
				<span style={{ fontStyle: 'italic' }}>
					By <a style={{ color: 'white' }} href={postBaseUrl} target='_blank' rel='noopener'>{postDomain}</a>
				</span><br/>
				<span>Added on {dateString}</span>
			</div>
		</Popup>
	)
}

export default PostPopup
