import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function PageHeader({ title, back = false }) {
	const navigate = useNavigate()

	return (
		<header className='page-header'>
			{back && (
				<button onClick={() => navigate('/')}>
					<ArrowLeft size={18} />
				</button>
			)}

			<h1>{title}</h1>
		</header>
	)
}

export default PageHeader
