import { combineReducers } from '@reduxjs/toolkit';

import tabviewReducer from './tabview-slice';

const livewireReducer = combineReducers({
	tabview: tabviewReducer,
});

export default livewireReducer;
