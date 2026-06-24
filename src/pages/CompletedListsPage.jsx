import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { supabase } from '../services/supabase'
import PageHeader from '../components/PageHeader'
import PageTransition from '../components/PageTransition'
import DeleteListSheet from '../components/DeleteListSheet'

import '../styles/completed.css'

function CompletedListsPage() {
	const [lists, setLists] = useState([])
	const [deleteItem, setDeleteItem] = useState(null)

	const loadLists = async () => {
		const { data } = await supabase
			.from('lists')
			.select(
				`
          *,
          todos(id)
        `,
			)
			.eq('completed', true)

		setLists(data || [])
	}

	useEffect(() => {
		loadLists()
	}, [])

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
				<PageHeader title='Wykonane' back />

				{lists.map(list => {
					const date = new Date(list.created_at).toLocaleDateString('pl-PL', {
						day: '2-digit',
						month: '2-digit',
					})

					return (
						<div key={list.id} className='completed-card'>
							<div className='completed-row'>
								<Link to={`/list/${list.id}`} className='completed-link-card'>
									<h3>{list.title}</h3>

									<p>{date}</p>
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

export default CompletedListsPage
