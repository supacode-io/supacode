import { Button } from '@blueprintjs/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';
import { removeLivewireTab, setLivewireActiveTabId } from '@/ui/store/livewire/tabview-slice';

function TableTabs() {
	const { tabs, activeTabId } = useSelector((state) => state.livewire.tabview);
	const dispatch = useDispatch();

	const handleClickOnTab = (e, tabId) => {
		e.stopPropagation();
		dispatch(setLivewireActiveTabId(tabId));
	};

	const handleClickOnClose = (e, tabId) => {
		e.stopPropagation();
		dispatch(removeLivewireTab(tabId));
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
					<span>{tab.name}</span>
					<Button
						icon="cross"
						onClick={(e) => handleClickOnClose(e, tab.id)}
						className={styles.tab_close_button}
					/>
				</div>
			))}
			{tabs.length > 0 ? <div className={styles.tabs_divider} /> : null}
		</div>
	);
}

export default TableTabs;
