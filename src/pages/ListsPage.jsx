import { useEffect, useState } from 'react'

import { supabase } from '../services/supabase'

import ListCard from '../components/ListCard'

import FloatingButton from '../components/FloatingButton'

import CreateListModal from '../components/CreateListModal'

import useRealtime from '../hooks/useRealtime'
import { CheckCircle2, ArrowUpDown, AlarmClock, ChevronDown } from 'lucide-react'

import EditListSheet from '../components/EditListSheet'
import DeleteListSheet from '../components/DeleteListSheet'
import PageTransition from '../components/PageTransition'

import { Link } from 'react-router-dom'

import '../styles/lists.css'
import '../styles/modal.css'

function ListsPage() {
	const [lists, setLists] = useState([])

	const [sortBy, setSortBy] = useState('date')

	const [openModal, setOpenModal] = useState(false)

	const [deleteItem, setDeleteItem] = useState(null)

	const [editingList, setEditingList] = useState(null)
	const [showSort, setShowSort] = useState(false)

	const [overdueCount, setOverdueCount] = useState(0)
	const [completedCount, setCompletedCount] = useState(0)

	const loadLists = async () => {
		const { data } = await supabase
			.from('lists')
			.select(
				`
    *,
    todos(id)
  `,
			)
			.eq('completed', false)

		const currentDay = new Date()
		currentDay.setHours(0, 0, 0, 0)

		const filteredLists = (data || []).filter(list => {
			if (!list.deadline) return true

			const deadline = new Date(list.deadline)
			deadline.setHours(0, 0, 0, 0)

			return deadline >= currentDay
		})

		setLists(filteredLists)

		const { count: completedTotal } = await supabase
			.from('lists')
			.select('*', {
				count: 'exact',
				head: true,
			})
			.eq('completed', true)

		setCompletedCount(completedTotal || 0)

		const today = new Date().toISOString().split('T')[0]

		const { count: overdueTotal } = await supabase
			.from('lists')
			.select('*', {
				count: 'exact',
				head: true,
			})
			.not('deadline', 'is', null)
			.lt('deadline', today)
			.eq('completed', false)

		setOverdueCount(overdueTotal || 0)
	}

	useEffect(() => {
		loadLists()
	}, [])

	useRealtime(() => {
		loadLists()
	})

	const createList = async (title, items, deadline) => {
		const { data: list, error } = await supabase
			.from('lists')
			.insert({
				title,
				deadline,
			})
			.select()
			.single()

		if (error) {
			console.error(error)
			return
		}

		await supabase.from('todos').insert(
			items.map(item => ({
				list_id: list.id,
				text: item,
			})),
		)

		setOpenModal(false)

		loadLists()
	}

	const deleteList = async () => {
		await supabase.from('lists').delete().eq('id', deleteItem.id)

		setDeleteItem(null)

		loadLists()
	}

	const saveListTitle = async (title, deadline) => {
		if (!editingList) return

		await supabase
			.from('lists')
			.update({
				title,
				deadline: deadline || null,
			})
			.eq('id', editingList.id)

		setEditingList(null)

		loadLists()
	}

	const sorted = [...lists].sort((a, b) => {
		if (sortBy === 'items') {
			return b.todos.length - a.todos.length
		}

		return new Date(b.created_at) - new Date(a.created_at)
	})

	return (
		<div className='page'>
			<PageTransition>
				<header>
					<h1>Moje listy</h1>

					<div className='sort-wrapper'>
						<button className='sort-button' onClick={() => setShowSort(!showSort)}>
							<ArrowUpDown size={16} />

							<span>{sortBy === 'date' ? 'Data' : 'Elementy'}</span>

							<ChevronDown size={16} />
						</button>

						{showSort && (
							<div className='sort-menu'>
								<button
									onClick={() => {
										setSortBy('date')
										setShowSort(false)
									}}>
									Data utworzenia
								</button>

								<button
									onClick={() => {
										setSortBy('items')
										setShowSort(false)
									}}>
									Liczba elementów
								</button>
							</div>
						)}
					</div>
				</header>
				<div className='quick-links'>
					<Link to='/completed' className='completed-link'>
						<CheckCircle2 size={20} />

						<div className='completed-info'>
							<span>Wykonane</span>
							<small className='completed-count'>{completedCount}</small>
						</div>
					</Link>

					<Link to='/overdue' className='completed-link overdue-link'>
						<AlarmClock size={20} />

						<div className='completed-info'>
							<span>Przeterminowane</span>
							<small className='completed-count'>{overdueCount}</small>
						</div>
					</Link>
				</div>

				<div className='lists'>
					{sorted.map(list => (
						<ListCard key={list.id} list={list} onDelete={setDeleteItem} onEdit={setEditingList} />
					))}
				</div>
			</PageTransition>
			<FloatingButton onClick={() => setOpenModal(true)} />

			<CreateListModal open={openModal} onClose={() => setOpenModal(false)} onSave={createList} />

			<EditListSheet open={!!editingList} list={editingList} onClose={() => setEditingList(null)} onSave={saveListTitle} />

			<DeleteListSheet open={!!deleteItem} list={deleteItem} onClose={() => setDeleteItem(null)} onConfirm={deleteList} />
		</div>
	)
}

export default ListsPage
