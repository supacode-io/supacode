const tabStore = (set, get) => ({
	tabs        : [],
	activeTabId : null,
	derived     : {
		get activeTab() {
			return get() ? get().tabs.find((t) => t.id === get().activeTabId) : null;
		},
	},
	addTab: (tab) => {
		set((state) => ({ tabs: [...state.tabs, tab] }));
	},
	setActiveTabId: (tabId) => {
		set({ activeTabId: tabId });
	},
	addActiveTab: (tab) => {
		set((state) => {
			const tabs = [...state.tabs];
			const existingTab = tabs.find((t) => t.id === tab.id);
			if (existingTab) return { activeTabId: existingTab.id };
			return { tabs: [...tabs, tab], activeTabId: tab.id };
		});
	},
	removeTab: (tabId) => {
		set((state) => {
			const tabs = [...state.tabs];
			const active = state.activeTabId === tabId;
			const index = tabs.findIndex((t) => t.id === tabId);
			let { activeTabId } = state;
			if (index > -1) {
				tabs.splice(index, 1);
			}
			if (active) {
				activeTabId = tabs.length > 0 ? tabs[0].id : null;
			}
			return { tabs, activeTabId };
		});
	},
});

export default tabStore;
