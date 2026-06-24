import { useEffect, useState } from 'react'

import { useParams, useNavigate } from 'react-router-dom'

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

import { ChevronDown, ChevronRight } from 'lucide-react'

import { supabase } from '../services/supabase'

import ProgressBar from '../components/ProgressBar'
import TodoItem from '../components/TodoItem'
import useRealtime from '../hooks/useRealtime'
import PageHeader from '../components/PageHeader'
import PageTransition from '../components/PageTransition'

import '../styles/details.css'

function ListDetailsPage() {
	const { id } = useParams()

	const navigate = useNavigate()

	const [list, setList] = useState(null)

	const [todos, setTodos] = useState([])

	const [newTodo, setNewTodo] = useState('')

	const [showCompleted, setShowCompleted] = useState(true)

	const loadList = async () => {
		const { data: listData } = await supabase.from('lists').select('*').eq('id', id).single()

		const { data: todosData } = await supabase.from('todos').select('*').eq('list_id', id).order('created_at', {
			ascending: true,
		})

		setList(listData)
		setTodos(todosData || [])
	}

	const updateListCompletionStatus = async updatedTodos => {
		const isCompleted = updatedTodos.length > 0 && updatedTodos.every(todo => todo.completed)

		await supabase
			.from('lists')
			.update({
				completed: isCompleted,
			})
			.eq('id', id)

		return isCompleted
	}

	useEffect(() => {
		loadList()
	}, [])

	useRealtime(() => {
		loadList()
	})

	const toggleTodo = async todo => {
		await supabase
			.from('todos')
			.update({
				completed: !todo.completed,
			})
			.eq('id', todo.id)

		const updated = todos.map(t =>
			t.id === todo.id
				? {
						...t,
						completed: !t.completed,
					}
				: t,
		)

		setTodos(updated)

		const isCompleted = await updateListCompletionStatus(updated)

		if (isCompleted) {
			navigate('/success')
		}
	}

	const addTodo = async () => {
		if (!newTodo.trim()) return

		await supabase.from('todos').insert({
			list_id: id,
			text: newTodo,
		})

		setNewTodo('')

		const updatedTodos = [
			...todos,
			{
				completed: false,
			},
		]

		await updateListCompletionStatus(updatedTodos)

		loadList()
	}

	const deleteTodo = async todoId => {
		await supabase.from('todos').delete().eq('id', todoId)

		const updatedTodos = todos.filter(todo => todo.id !== todoId)

		setTodos(updatedTodos)

		const isCompleted = await updateListCompletionStatus(updatedTodos)

		if (isCompleted) {
			navigate('/success')
		}
	}

	const completed = todos.filter(todo => todo.completed).length

	const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0

	const activeTodos = todos.filter(todo => !todo.completed)

	const completedTodos = todos.filter(todo => todo.completed)

	if (!list) return null

	return (
		<div className='details-page'>
			<PageTransition>
				<PageHeader title={list.title} back />

				<ProgressBar progress={progress} />
				<LayoutGroup>
					<div className='todo-list'>
						<AnimatePresence>
							{activeTodos.map(todo => (
								<motion.div
									key={todo.id}
									layout
									initial={{
										opacity: 0,
										y: 10,
									}}
									animate={{
										opacity: 1,
										y: 0,
									}}
									exit={{
										opacity: 0,
										scale: 0.95,
									}}
									transition={{
										layout: {
											duration: 0.35,
										},
									}}>
									<TodoItem todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
								</motion.div>
							))}
						</AnimatePresence>

						{completedTodos.length > 0 && (
							<>

								<div className='completed-title'>
									<button className='completed-toggle' onClick={() => setShowCompleted(!showCompleted)}>
										{showCompleted ? <ChevronDown size={16} /> : <ChevronRight size={16} />}

										<span>Wykonane ({completedTodos.length})</span>
									</button>
								</div>

								<AnimatePresence>
									{showCompleted &&
										completedTodos.map(todo => (
											<motion.div
												key={todo.id}
												layout
												initial={{
													opacity: 0,
													y: 10,
												}}
												animate={{
													opacity: 1,
													y: 0,
												}}
												exit={{
													opacity: 0,
													scale: 0.95,
												}}
												transition={{
													layout: {
														duration: 0.35,
													},
												}}>
												<TodoItem todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
											</motion.div>
										))}
								</AnimatePresence>
							</>
						)}
					</div>
				</LayoutGroup>
			</PageTransition>
			<div className='add-todo'>
				<input placeholder='Nowe zadanie' value={newTodo} onChange={e => setNewTodo(e.target.value)} />

				<button onClick={addTodo}>Dodaj</button>
			</div>
		</div>
	)
}

export default ListDetailsPage
