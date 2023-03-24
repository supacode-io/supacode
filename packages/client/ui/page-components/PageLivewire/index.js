import React from 'react';

import ActiveView from './ActiveView';
import Sidebar from './Sidebar';
import styles from './styles.module.css';
import ViewTabs from './ViewTabs';

function PageLivewire() {
	return (
		<div className={styles.container}>
			<div className={styles.sidebar}>
				<Sidebar />
			</div>
			<div className={styles.content}>
				<ViewTabs key="livewire" />
				<ActiveView />
			</div>
		</div>
	);
}

export default PageLivewire;
