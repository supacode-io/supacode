import { Dialog, DialogBody, DialogFooter, Button } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormLayout from './FormLayout';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { Toast } from '@/ui/components/Toaster';

const RESERVED_COLUMNS = ['_id', '_created_on', '_updated_on', '_published_on'];

function AddRowModal({ triggerList, tableName, show, onClose }) {
	const router = useRouter();
	const { projectCode } = router.query;

	const [{ data }] = useCmsRequest({
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/columns`,
		params : { limit: 100 },
	}, { manual: !tableName });
	const methods = useForm({ defaultValues: {} });

	const { columns = [] } = data || {};
	const filteredColumns = useMemo(() => columns.filter((c) => !RESERVED_COLUMNS.includes(c.column_name)), [columns]);

	const [, triggerCreate] = useCmsRequest({
		method : 'POST',
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/rows`,
	}, { manual: true });

	const onSubmit = async (values) => {
		try {
			await triggerCreate({ data: values });
			Toast.show({ message: 'Row added successfully', intent: 'success' });
			methods.reset();
			await triggerList();
			onClose();
		} catch (error) {
			Toast.show({ message: error?.response?.data.message, intent: 'error' });
		}
	};

	const onError = (err) => {
		console.log('error', err);
	};

	return (
		<Dialog
			className={styles.dialog_container}
			icon="add-row-bottom"
			title={`Add new row in "${tableName}"`}
			isOpen={show}
			onClose={onClose}
		>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit, onError)}>
					<DialogBody>
						<FormLayout tableName={tableName} columns={filteredColumns} />
					</DialogBody>
					<DialogFooter
						actions={
							<Button intent="primary" type="submit" text="Add Row" />
						}
					/>
				</form>
			</FormProvider>
			{/* <div className={styles.view_container}>
			</div> */}
		</Dialog>
	);
}

export default AddRowModal;
