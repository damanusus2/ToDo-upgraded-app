import { motion } from 'framer-motion'

function PageTransition({ children }) {
	return (
		<motion.main
			className='page-transition'
			initial={{
				opacity: 0,
				x: 20,
			}}
			animate={{
				opacity: 1,
				x: 0,
			}}
			exit={{
				opacity: 0,
				x: -20,
			}}>
			{children}
		</motion.main>
	)
}

export default PageTransition
