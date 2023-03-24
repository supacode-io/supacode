import React from 'react';
import { useSelector } from 'react-redux';

import ColumnsView from './ColumnsView';
import EditRowView from './EditRowView';
import TableView from './TableView';

const componentMap = {
	TableView,
	ColumnsView,
	EditRowView,
};

function ActiveView() {
	const activeTab = useSelector((state) => {
		const { tabs, activeTabId } = state.datastore.tabview;
		return tabs.find((t) => t.id === activeTabId);
	});

	if (!activeTab) return null;
	const Component = componentMap[activeTab?.component] || (() => null);
	return <Component key={activeTab.id} {...activeTab.props} />;
}

export default ActiveView;
