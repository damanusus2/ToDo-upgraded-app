import { useEffect, useState } from 'react'

import BottomSheet from './BottomSheet'

function EditListSheet({ open, list, onClose, onSave }) {
	const [title, setTitle] = useState('')
	const [deadline, setDeadline] = useState('')

	useEffect(() => {
		if (list) {
			setTitle(list.title)
			setDeadline(list.deadline || '')
		}
	}, [list])

	return (
		<BottomSheet open={open} onClose={onClose}>
			<h2>Edytuj listę</h2>

			<input value={title} onChange={e => setTitle(e.target.value)} />
			<input type='date' value={deadline} onChange={e => setDeadline(e.target.value)} />

			<div className='modal-actions'>
				<button className='secondary' onClick={onClose}>
					Anuluj
				</button>

				<button onClick={() => onSave(title, deadline || null)}>Zapisz</button>
			</div>
		</BottomSheet>
	)
}

export default EditListSheet
