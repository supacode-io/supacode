import { Classes, Icon } from '@blueprintjs/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';

function Sidebar({ admin = false }) {
	const router = useRouter();
	const { query, asPath } = router;
	const { projectCode } = query;
	let navs;

	if (admin) {
		navs = [
			{ title: 'Users', icon: <Icon size={24} icon="mugshot" />, href: '/admin' },
			{ title: 'Audit Logs', icon: <Icon size={24} icon="history" />, href: '/audit' },
		];
	} else {
		navs = [
			{ title: 'Datastore', icon: <Icon size={24} icon="database" />, href: `/app/${projectCode}/datastore` },
			{ title: 'Vault', icon: <Icon size={24} icon="folder-open" />, href: `/app/${projectCode}/vault` },
			{ title: 'Livewire', icon: <Icon size={24} icon="lightning" />, href: `/app/${projectCode}/livewire` },
		];
	}

	return (
		<div className={cl`${styles.container} ${Classes.ELEVATION_1}`}>
			<ul className={styles.menu_list}>
				{navs.map((nav) => (
					<li
						key={nav.title}
						className={cl`
					${styles.menu_item}
					${asPath === nav.href ? styles.menu_item_active : ''}
					`}
					>
						<Link href={nav.href}>
							<div className={styles.menu_icon_container}>
								{nav.icon}
							</div>
							<p className={styles.menu_title_text}>{nav.title}</p>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Sidebar;
