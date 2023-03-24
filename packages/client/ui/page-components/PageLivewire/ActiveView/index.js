import React from 'react';
import { useSelector } from 'react-redux';

import CollectionView from './CollectionView';

const componentMap = {
	CollectionView,
};

function ActiveView() {
	const activeTab = useSelector((state) => {
		const { tabs, activeTabId } = state.livewire.tabview;
		return tabs.find((t) => t.id === activeTabId);
	});

	if (!activeTab) return null;
	const Component = componentMap[activeTab?.component] || (() => null);
	return <Component key={activeTab.id} {...activeTab.props} />;
}

export default ActiveView;
