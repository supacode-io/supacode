import React from 'react';

import styles from './styles.module.css';

import { flattenErrorToString } from '@/external-packages/utils';

function RequestView({ loading, error, children }) {
	if (loading) {
		return (
			<div className={styles.loading_container}>
				<span className={styles.loading_text}>...</span>
			</div>
		);
	}
	if (error) {
		return (
			<div className={styles.error_container}>
				<p className={styles.error_text}>
					{flattenErrorToString(error)}
				</p>
			</div>
		);
	}

	return children;
}

export default RequestView;
