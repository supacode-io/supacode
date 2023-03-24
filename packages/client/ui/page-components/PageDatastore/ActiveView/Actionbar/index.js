import { InputGroup } from '@blueprintjs/core';
import React from 'react';

import styles from './styles.module.css';

function Actionbar({
	buttons,
	showSearch = false,
	searchProps = {},
	// paginationProps = null,
	extras,
}) {
	return (
		<div className={styles.action_container}>
			<div className={styles.start_container}>
				{showSearch ? (
					<div className={styles.search_container}>
						<InputGroup placeholder="Search" {...searchProps} />
					</div>
				) : null}
				<div className={styles.button_container}>
					{buttons}
				</div>
			</div>
			{extras ? (
				<div className={styles.end_container}>
					{extras}
				</div>
			) : extras}

		</div>
	);
}

export default Actionbar;
