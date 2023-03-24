import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth';
import datastoreReducer from './datastore';
import livewireReducer from './livewire';

const store = configureStore({
	reducer: {
		datastore : datastoreReducer,
		livewire  : livewireReducer,
		auth      : authReducer,
	},
});

export default store;
