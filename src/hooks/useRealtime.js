import { useEffect } from 'react'
import { supabase } from '../services/supabase'

function useRealtime(callback) {
	useEffect(() => {
		const channel = supabase
			.channel('todos-realtime')

			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'lists',
				},
				callback,
			)

			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'todos',
				},
				callback,
			)

			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [])
}

export default useRealtime
