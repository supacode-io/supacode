import React from 'react';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';

function Content({ hasSidebar, children }) {
	return (
		<div
			className={cl`
				${styles.container}
				${hasSidebar ? styles.has_sidebar : ''}
			`}
		>
			{children}
		</div>
	);
}

export default Content;
