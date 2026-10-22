import { Link } from 'react-router';

// Not converted yet: its loader and action had to go when ssr went off.
export default function ItemViewRoute() {
	return (
		<p className="mt-4">
			Coming up next. (<Link to="/items">back</Link>)
		</p>
	);
}
