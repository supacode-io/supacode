import { Button } from '@blueprintjs/core';
import React from 'react';

import Logo from './logo.svg';
import styles from './styles.module.css';

function PageSetup() {
	return (
		<div className={styles.container}>
			<div className={styles.logo_container}>
				<p className={styles.logo_pre_text}>
					Welcome to
				</p>
				<Logo className={styles.logo_svg} />
			</div>
			<h1 className={styles.title}>Let&apos;s get you started</h1>
			<Button loading>Submit</Button>
		</div>
	);
}

export default PageSetup;
