import React from 'react';

import LoginContent from './LoginContent';
import LoginForm from './LoginForm';
import styles from './styles.module.css';

function PageLogin() {
	return (
		<div className={styles.container}>
			<img
				className={styles.cmslogo}
				alt="logo"
			/>
			<div className={styles.content_side}>
				<LoginContent />
			</div>
			<div className={styles.login_side}>
				<LoginForm />
			</div>

			<img
				className={styles.background}
				alt="cms-background"
			/>
		</div>
	);
}

export default PageLogin;
