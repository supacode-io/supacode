/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	tabs        : [],
	activeTabId : null,
};

export const tabviewSlice = createSlice({
	name     : 'tabs',
	initialState,
	reducers : {
		addDatastoreTab: (state, action) => {
			state.tabs.push(action.payload);
		},
		setDatastoreActiveTabId: (state, action) => {
			state.activeTabId = action.payload;
		},
		addDatastoreActiveTab: (state, action) => {
			const { payload } = action;
			const existingTab = state.tabs.find((t) => t.id === payload.id);
			if (existingTab) {
				state.activeTabId = existingTab.id;
			} else {
				state.tabs.push(payload);
				state.activeTabId = payload.id;
			}
		},
		removeDatastoreTab: (state, action) => {
			const { payload } = action;
			const index = state.tabs.findIndex((t) => t.id === payload);
			if (index > -1) {
				state.tabs.splice(index, 1);
			}
			const active = state.activeTabId === payload;
			if (active) {
				state.activeTabId = state.tabs.length > 0 ? state.tabs[0].id : null;
			}
		},
	},
});

export const { setDatastoreActiveTabId, addDatastoreActiveTab, removeDatastoreTab } = tabviewSlice.actions;

export default tabviewSlice.reducer;
