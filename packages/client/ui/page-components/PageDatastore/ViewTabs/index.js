import { Button } from '@blueprintjs/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';
import { removeDatastoreTab, setDatastoreActiveTabId } from '@/ui/store/datastore/tabview-slice';

function TableTabs() {
	const { tabs, activeTabId } = useSelector((state) => state.datastore.tabview);
	const dispatch = useDispatch();

	const handleClickOnTab = (e, tabId) => {
		e.stopPropagation();
		dispatch(setDatastoreActiveTabId(tabId));
	};

	const handleClickOnClose = (e, tabId) => {
		e.stopPropagation();
		dispatch(removeDatastoreTab(tabId));
	};

	return (
		<div className={styles.tab_list}>
			{tabs.map((tab) => (
				<div
					key={tab.id}
					className={cl`
						${styles.tab_item}
						${activeTabId === tab.id ? styles.active : ''}
					`}
					onClick={(e) => handleClickOnTab(e, tab.id)}
					role="button"
					tabIndex="0"
				>
					<span className={styles.tab_title}>{tab.name}</span>
					<Button onClick={(e) => handleClickOnClose(e, tab.id)} small minimal icon="cross" />
					{/* <ClearButton onClick={(e) => handleClickOnClose(e, tab.id)} className={styles.tab_close_button}>
						<IcMCross className={styles.tab_close_icon} />
					</ClearButton> */}
				</div>
			))}
			{tabs.length > 0 ? <div className={styles.tabs_divider} /> : null}
		</div>
	);
}

export default TableTabs;
