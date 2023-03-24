import { Button } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Actionbar from '../Actionbar';

import ColumnDetails from './ColumnDetails';
import ColumnList from './ColumnList';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

function ColumnsView({ tableName }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const [activeDetails, setActiveDetails] = useState({ show: false, payload: null });

	const [{ data }, trigger] = useCmsRequest({
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/columns`,
		params : { limit: 100 },
	}, { manual: !tableName });

	const { columns } = data || {};

	return (
		<div className={styles.container}>
			<Actionbar
				showSearch
				buttons={(
					<Button icon="add" onClick={() => setActiveDetails({ show: true })}>
						<span>Add Column</span>
					</Button>
				)}
			/>
			<div className={styles.view_container}>
				<div className={styles.list_container}>
					<ColumnList
						columns={columns}
						projectCode={projectCode}
						tableName={tableName}
						trigger={trigger}
						onClickColumn={(column) => {
							setActiveDetails({ show: true, payload: { column } });
						}}
					/>
				</div>
				<div className={styles.details_container}>
					{activeDetails?.show ? (
						<ColumnDetails
							{...activeDetails?.payload}
							tableName={tableName}
							onCreateSuccess={async () => {
								await trigger();
							}}
						/>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default ColumnsView;
