import { X } from 'lucide-react'
function TodoItem({ todo, onToggle, onDelete }) {
	return (
		<div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
			<label>
				<input type='checkbox' checked={todo.completed} onChange={() => onToggle(todo)} />

				<span>{todo.text}</span>
			</label>

			<button className='icon-button' onClick={() => onDelete(todo.id)} aria-label='Usuń zadanie'>
				<X size={18} />
			</button>
		</div>
	)
}

export default TodoItem
