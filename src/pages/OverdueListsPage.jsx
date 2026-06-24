import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { AlarmClock, Trash2 } from 'lucide-react'

import { supabase } from '../services/supabase'

import DeleteListSheet from '../components/DeleteListSheet'
import PageHeader from '../components/PageHeader'
import PageTransition from '../components/PageTransition'
import useRealtime from '../hooks/useRealtime'

import '../styles/completed.css'

function OverdueListsPage() {
	const [lists, setLists] = useState([])

	const [deleteItem, setDeleteItem] = useState(null)

	const loadLists = async () => {
		const today = new Date().toISOString().split('T')[0]

		const { data } = await supabase
			.from('lists')
			.select(
				`
					*,
					todos(id)
				`,
			)
			.not('deadline', 'is', null)
			.lt('deadline', today)
			.eq('completed', false)

		setLists(data || [])
	}

	useEffect(() => {
		loadLists()
	}, [])
	useRealtime(() => {
		loadLists()
	})

	const deleteList = async () => {
		if (!deleteItem) return

		await supabase.from('todos').delete().eq('list_id', deleteItem.id)

		await supabase.from('lists').delete().eq('id', deleteItem.id)

		setDeleteItem(null)

		loadLists()
	}

	return (
		<PageTransition>
			<div className='completed-page'>
				<PageHeader title='Przeterminowane' back />

				{lists.map(list => {
					const deadline = new Date(list.deadline).toLocaleDateString('pl-PL')

					return (
						<div key={list.id} className='completed-card overdue-card'>
							<div className='completed-row'>
								<Link to={`/list/${list.id}`} className='completed-link-card'>
									<h3>{list.title}</h3>

									<p>
										<AlarmClock size={14} /> {deadline}
									</p>
								</Link>

								<button className='icon-button' onClick={() => setDeleteItem(list)}>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					)
				})}

				<DeleteListSheet open={!!deleteItem} list={deleteItem} onClose={() => setDeleteItem(null)} onConfirm={deleteList} />
			</div>
		</PageTransition>
	)
}

export default OverdueListsPage
