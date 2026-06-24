import { motion, AnimatePresence } from 'framer-motion'

function BottomSheet({ open, onClose, children }) {
	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div className='sheet-overlay' onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

					<motion.div
						className='bottom-sheet'
						initial={{
							y: '100%',
						}}
						animate={{
							y: 0,
						}}
						exit={{
							y: '100%',
						}}
						transition={{
							type: 'spring',
							damping: 28,
							stiffness: 280,
						}}>
						<div className='sheet-handle' />

						{children}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export default BottomSheet
