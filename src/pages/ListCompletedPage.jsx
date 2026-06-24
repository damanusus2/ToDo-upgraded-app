import { useNavigate } from 'react-router-dom'

import { PartyPopper } from 'lucide-react'

import { motion } from 'framer-motion'

import PageTransition from '../components/PageTransition'

import '../styles/completed-success.css'

function ListCompletedPage() {
	const navigate = useNavigate()

	return (
		<PageTransition>
			<div className='success-page'>
				<motion.div className='success-icon'>
					<PartyPopper size={48} />
				</motion.div>

				<h1>Dobra robota!</h1>

				<p>Lista została ukończona.</p>

				<button className='success-button' onClick={() => navigate('/')}>
					Wróć do list
				</button>
			</div>
		</PageTransition>
	)
}

export default ListCompletedPage
