import { Button } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';

import Actionbar from '../Actionbar';

import FormLayout from './FormLayout';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

function EditRowView({ tableName, rowId }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const [{ data: rowData }] = useCmsRequest({
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/rows/${rowId}`,
		params : { limit: 100 },
	});
	const { row } = rowData || {};

	const [{ data }] = useCmsRequest({
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/columns`,
		params : { limit: 100 },
	}, { manual: !tableName });

	const { columns } = data || {};
	const handleClickOnColumns = () => {
		console.log('clicked');
	};

	return (
		<div className={styles.container}>
			<Actionbar
				showSearch
				buttons={(
					<Button text="Columns" icon="add" onClick={handleClickOnColumns} />
				)}
			/>
			<div className={styles.view_container}>
				{!isEmpty(row) && !isEmpty(columns)
					? <FormLayout tableName={tableName} row={row} columns={columns} />
					: null}
			</div>
		</div>
	);
}

export default EditRowView;
