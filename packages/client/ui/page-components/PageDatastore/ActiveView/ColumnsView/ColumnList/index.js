import { Icon } from '@blueprintjs/core';
import React from 'react';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

const EXCLUSION_COLUMNS = ['_id', '_created_on', '_updated_on', '_published_on'];

function ColumnList({ projectCode, trigger, tableName, columns, onClickColumn = () => {} }) {
	const handleClick = (column) => {
		onClickColumn(column);
	};
	const [, triggerDelete] = useCmsRequest({
		method: 'delete',
	}, { manual: true });

	const handleDelete = async (e, column_name) => {
		e.stopPropagation();
		const res = window.confirm('Are you sure you want to delete the column?');
		if (res) {
			await triggerDelete({ url: `/v1/${projectCode}/datastore/tables/${tableName}/columns/${column_name}` });
			await trigger();
		}
	};
	return (
		<ul className={styles.column_list}>
			{columns?.map((column) => (
				<li className={styles.column_item} key={column.column_name}>
					<div
						role="button"
						tabIndex={0}
						className={styles.column_item_inner}
						onClick={() => handleClick(column)}
					>
						<span>{column.column_name}</span>
						{
							EXCLUSION_COLUMNS.some((item) => item === column.column_name)
								?							(
									null
								) : (
									<span role="presentation" onClick={(e) => handleDelete(e, column.column_name)}>
										<Icon icon="trash" />
									</span>
								)
						}
					</div>
				</li>
			))}
		</ul>
	);
}

export default ColumnList;
