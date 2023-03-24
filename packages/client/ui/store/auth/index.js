/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	sessionInitialized : false,
	sessionId          : null,
	session            : null,
};

export const authSlice = createSlice({
	name     : 'auth',
	initialState,
	reducers : {
		markSessionInitialized: (state) => {
			state.sessionInitialized = true;
		},
		setSession: (state, action) => {
			const { sessionId, session } = action.payload;
			state.sessionId = sessionId;
			state.session = session;
		},
		destroySession: (state) => {
			state.sessionId = null;
			state.session = null;
		},
	},
});

export const { markSessionInitialized, setSession, destroySession } = authSlice.actions;

export default authSlice.reducer;
