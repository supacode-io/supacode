import { Classes } from '@blueprintjs/core';
import React from 'react';
import { useSelector } from 'react-redux';

import ActiveView from './ActiveView';
import Sidebar from './Sidebar';
import styles from './styles.module.css';
import ViewTabs from './ViewTabs';

import cl from '@/ui/helpers/classnames';

function PageDatastore() {
	return (
		<div className={styles.container}>
			<div className={cl`${styles.sidebar} ${Classes.ELEVATION_1}`}>
				<Sidebar />
			</div>
			<div className={styles.content}>
				<ViewTabs key="datastore" />
				<div className={styles.active_view_container}>
					<ActiveView />
				</div>
			</div>
		</div>
	);
}

export default PageDatastore;
