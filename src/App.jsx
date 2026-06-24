import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import { AnimatePresence } from 'framer-motion'

import ListsPage from './pages/ListsPage'
import ListDetailsPage from './pages/ListDetailsPage'
import CompletedListsPage from './pages/CompletedListsPage'
import OverdueListsPage from './pages/OverdueListsPage'
import ListCompletedPage from './pages/ListCompletedPage'

function AnimatedRoutes() {
	const location = useLocation()

	return (
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				<Route path='/' element={<ListsPage />} />

				<Route path='/list/:id' element={<ListDetailsPage />} />

				<Route path='/completed' element={<CompletedListsPage />} />

				<Route path='/overdue' element={<OverdueListsPage />} />

				<Route path='/success' element={<ListCompletedPage />} />
			</Routes>
		</AnimatePresence>
	)
}

function App() {
	return (
		<BrowserRouter>
			<AnimatedRoutes />
		</BrowserRouter>
	)
}

export default App
