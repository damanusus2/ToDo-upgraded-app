function ProgressBar({ progress }) {
	return (
		<div className='progress-wrapper'>
			<div className='progress-info'>
				<span>Postęp</span>
				<span>{progress}%</span>
			</div>

			<div className='progress-track'>
				<div
					className='progress-fill'
					style={{
						width: `${progress}%`,
					}}
				/>
			</div>
		</div>
	)
}

export default ProgressBar
