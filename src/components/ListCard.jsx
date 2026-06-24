import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Calendar } from 'lucide-react'

function ListCard({ list, onDelete, onEdit }) {
	const date = new Date(list.created_at).toLocaleDateString('pl-PL', {
		day: '2-digit',
		month: '2-digit',
	})

	const getDeadlineState = deadline => {
		if (!deadline) return 'normal'

		const today = new Date()

		today.setHours(0, 0, 0, 0)

		const target = new Date(deadline)

		const diff = Math.ceil((target - today) / 86400000)

		if (diff <= 0) return 'danger'

		if (diff <= 4) return 'warning'

		return 'future'
	}

	const deadlineState = getDeadlineState(list.deadline)
	const navigate = useNavigate()

	return (
		<div className={`list-card ${deadlineState}`} onClick={() => navigate(`/list/${list.id}`)}>
			<div>
				<h3>{list.title}</h3>

				{list.deadline && (
					<span className={`deadlina-date`}>
						<Calendar size={16} />
						{new Date(list.deadline).toLocaleDateString('pl-PL')}
					</span>
				)}
			</div>

			<div className='actions'>
				<button
					className='icon-button'
					onClick={e => {
						e.stopPropagation()
						onEdit(list)
					}}
					aria-label='Edytuj listę'>
					<Pencil size={18} />
				</button>

				<button
					className='icon-button'
					onClick={e => {
						e.stopPropagation()
						onDelete(list)
					}}
					aria-label='Usuń listę'>
					<Trash2 size={18} />
				</button>
			</div>
		</div>
	)
}

export default ListCard
