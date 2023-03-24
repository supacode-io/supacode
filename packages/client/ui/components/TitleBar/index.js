import React from 'react';

import styles from './styles.module.css';

function TitleBar({ title = 'Page Title' }) {
	return (
		<div className={styles.container}>
			<h1 className={styles.title_text}>{title}</h1>
		</div>
	);
}

export default TitleBar;
