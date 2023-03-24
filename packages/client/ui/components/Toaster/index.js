import { Toaster, Position } from '@blueprintjs/core';

// export const Toast = Toaster.create({
// 	position: Position.TOP,
// });

// ------------------------------------

const createToaster = () => {
	let Toast = {};
	if (typeof window !== 'undefined') {
		Toast = Toaster.create({
			position: Position.TOP,
		});
	}
	return Toast;
};

console.log('-hi-');

export const Toast = createToaster();

export const toastSuccess = (message) => Toast.show({ message, intent: 'success' });

export const toastError = (message) => Toast.show({ message, intent: 'danger' });
