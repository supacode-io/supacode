import { useRouter } from 'next/router';
import React from 'react';

import Content from './Content';
import Sidebar from './Sidebar';
import styles from './styles.module.css';
import Topbar from './Topbar';

import cl from '@/ui/helpers/classnames';

const ROUTE_LAYOUT_MAP = {
	'*'      : { topbar: true, sidebar: true, admin: false },
	'/'      : { topbar: true, sidebar: false, admin: false },
	'/setup' : { topbar: false, sidebar: false, admin: false },
	'/login' : { topbar: false, sidebar: false, admin: false },
	'/admin' : { topbar: true, sidebar: true, admin: true },
};

function Layout({ children = null }) {
	const { route } = useRouter();

	const {
		topbar: showTopbar,
		sidebar: showSidebar,
		admin:showadmin,
	} = ROUTE_LAYOUT_MAP[route] || ROUTE_LAYOUT_MAP['*'];

	return (
		<div className={styles.container}>
			{showTopbar ? <Topbar /> : null}
			<div
				className={cl`
					${showTopbar ? styles.has_topbar : ''}
					${styles.inner_container}
				`}
			>
				<Content hasSidebar={showSidebar}>
					{children}
				</Content>
				{showSidebar ? <Sidebar admin={showadmin} /> : null}
			</div>
		</div>
	);
}

export default Layout;
