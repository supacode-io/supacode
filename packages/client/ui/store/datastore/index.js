import { combineReducers } from '@reduxjs/toolkit';

import tabviewReducer from './tabview-slice';

const datastoreReducer = combineReducers({
	tabview: tabviewReducer,
});

export default datastoreReducer;
