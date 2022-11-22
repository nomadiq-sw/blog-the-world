import Popup from 'reactjs-popup'

const PostPopup = ({post, trigger}) => {
	const dateString = new Date(post.date).toLocaleDateString()

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
					   target='_blank' rel='noreferrer'>
						{post.title}
					</a>
				</span><br/>
				<span>Added on {dateString}</span>
			</div>
		</Popup>
	)
}

export default PostPopup
