import { Button } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormControl from './FormControl';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

const reserved_columns = ['_id', '_created_on', '_updated_on', '_published_on'];

function FormLayout({ tableName, row = {}, columns = [] }) {
	const router = useRouter();
	const { projectCode } = router.query;
	// eslint-disable-next-line max-len
	const formColumns = useMemo(() => columns.filter((column) => !reserved_columns.includes(column.column_name)), [columns]);

	const defaultValues = useMemo(() => formColumns.reduce((acc, column) => {
		if (column.cms_column.cms_type === 'json') {
			acc[column.column_name] = JSON.stringify(row[column.column_name]);
		} else {
			acc[column.column_name] = row[column.column_name];
		}
		return acc;
	}, {}), [formColumns, row]);

	const methods = useForm({ defaultValues });
	const { handleSubmit } = methods;

	const [, triggerUpdate] = useCmsRequest({
		method : 'PATCH',
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/rows/${row._id}`,
	}, { manual: true });

	const onSubmit = async (values) => {
		await triggerUpdate({ data: values });
		window.confirm('Updated successfully');
	};

	const onError = (err) => {
		console.log('error', err);
	};
	console.log(formColumns);
	return (
		<div>
			<div className={styles.form_container}>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(onSubmit, onError)}>
						{formColumns
							.map(((column) => (
								<div key={column.column_name} className={styles.form_item}>
									<label htmlFor={`control-${column.column_name}`}>{column.column_name}</label>
									<FormControl id={`control-${column.column_name}`} column={column} />
								</div>
							)))}
						<div className={styles.form_actions}>
							<Button text="Submit" type="submit" />
						</div>
					</form>
				</FormProvider>
			</div>
		</div>
	);
}

export default FormLayout;
