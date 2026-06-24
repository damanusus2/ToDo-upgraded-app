import BottomSheet from './BottomSheet'

import { Trash2 } from 'lucide-react'

function DeleteListSheet({ open, list, onClose, onConfirm }) {
	if (!list) return null

	return (
		<BottomSheet open={open} onClose={onClose}>
			<div className='delete-sheet'>
				<div className='delete-icon'>
					<Trash2 size={24} />
				</div>

				<h2>Usuń listę</h2>

				<p>
					Czy na pewno chcesz usunąć listę
					<strong> "{list.title}"</strong>?
				</p>

				<p className='delete-warning'>Tej operacji nie można cofnąć.</p>

				<div className='delete-actions'>
					<button className='secondary' onClick={onClose}>
						Anuluj
					</button>

					<button className='danger-button' onClick={onConfirm}>
						Usuń
					</button>
				</div>
			</div>
		</BottomSheet>
	)
}

export default DeleteListSheet
