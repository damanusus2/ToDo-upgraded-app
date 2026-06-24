import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import BottomSheet from './BottomSheet'
function CreateListModal({ open, onClose, onSave }) {
	const [title, setTitle] = useState('')

	const [items, setItems] = useState([''])

	const [deadline, setDeadline] = useState('')

	useEffect(() => {
		if (!open) {
			const timer = setTimeout(() => {
				setTitle('')
				setItems([''])
			}, 300)

			return () => clearTimeout(timer)
		}
	}, [open])

	const updateItem = (index, value) => {
		const updated = [...items]

		updated[index] = value

		setItems(updated)
	}

	const addItem = () => {
		setItems([...items, ''])
	}

	const removeItem = index => {
		setItems(items.filter((_, i) => i !== index))
	}

	const handleSave = () => {
		const filtered = items.filter(item => item.trim())

		if (!title.trim() || filtered.length === 0) {
			return
		}

		onSave(title, filtered, deadline || null)

		setTitle('')
		setItems([''])
	}

	return (
		<BottomSheet open={open} onClose={onClose}>
			<h2>Nowa lista</h2>

			<input placeholder='Tytuł listy' value={title} onChange={e => setTitle(e.target.value)} />
			<div className='field-group'>
				<input type='date' value={deadline} onChange={e => setDeadline(e.target.value)} />
			</div>

			<div className='items-section'>
				{items.map((item, index) => (
					<div key={index} className='item-row'>
						<input placeholder={`Pozycja ${index + 1}`} value={item} onChange={e => updateItem(index, e.target.value)} />

						{items.length > 1 && (
							<button className='delete-item' onClick={() => removeItem(index)} aria-label='Usuń pozycję'>
								<X size={25} />
							</button>
						)}
					</div>
				))}
			</div>

			<button className='add-item' onClick={addItem}>
				+ Dodaj pozycję
			</button>

			<div className='modal-actions'>
				<button className='secondary' onClick={onClose}>
					Anuluj
				</button>

				<button onClick={handleSave}>Utwórz</button>
			</div>
		</BottomSheet>
	)
}

export default CreateListModal
