import { Plus } from "lucide-react";
function FloatingButton({ onClick }) {
	return (
		<button className='fab' onClick={onClick}>
			<Plus size={25} />
		</button>
	)
}

export default FloatingButton
