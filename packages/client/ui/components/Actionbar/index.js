import { InputGroup } from '@blueprintjs/core';
import React from 'react';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';

function ActionSearch({
	onChange = () => {},
	...rest
}) {
	return (
		<InputGroup
			leftIcon="search"
			{...rest}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}

function Actionbar({
	className,
	style,
	buttons,
	showSearch = false,
	searchProps = {},
	// paginationProps = null,
	extras = null,
}) {
	return (
		<div
			className={cl`
				${className}
				${styles.container}
			`}
			style={style}
		>
			<div className={styles.start_container}>
				{showSearch ? (
					<div className={styles.search_container}>
						<ActionSearch
							placeholder="Search"
							{...searchProps}
						/>
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
