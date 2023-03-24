import ReactDOM from 'react-dom';

function Portal({ children = null, id = '__portal' }) {
	if (typeof window === 'undefined') {
		return null;
	}
	let element = document.getElementById(id);
	if (!element) {
		const newDiv = document.createElement('div');
		newDiv.setAttribute('id', id);

		const body = document.getElementsByTagName('body')[0];
		element = body.appendChild(newDiv);
	}
	return ReactDOM.createPortal(children, element);
}

export default Portal;
