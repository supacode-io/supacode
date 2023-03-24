import { Button, FormGroup, H3 } from '@blueprintjs/core';
import { startCase } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { ControlledInput, ControlledSelect } from '@/external-packages/components';
import ControlledTextarea from '@/external-packages/components/ControlledTextarea';
import { useCmsRequest } from '@/external-packages/request';
import { Toast } from '@/ui/components/Toaster';

const CMS_TYPE_MAP = {
	id         : 'uuid',
	text       : 'varchar(255)',
	long_text  : 'text',
	rich_text  : 'text',
	list       : 'varchar(255)',
	multi_list : 'varchar(255)[]',
	integer    : 'int',
	decimal    : 'float',
	serial     : 'serial',
	timestamp  : 'timestamptz',
	boolean    : 'bool',
	reference  : 'uuid',
	json       : 'jsonb',
};

const TYPE_OPTIONS = Object.entries(CMS_TYPE_MAP).map((e) => ({ label: startCase(e[0]), value: e[0] }));

function ColumnDetails({ tableName, column, onCreateSuccess = () => {} }) {
	const router = useRouter();
	const { projectCode } = router.query;

	const methods = useForm({
		defaultValues: {
			name        : column.column_name,
			cms_type    : column.cms_column.cms_type,
			description : column.description,

		},
	});
	const { handleSubmit, formState: { errors } } = methods;

	const [{ loading: loadingCreate }, triggerCreate] = useCmsRequest({
		method : 'POST',
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/columns`,
	}, { manual: true });

	const [{ loading: loadingUpdate }, triggerUpdate] = useCmsRequest({
		method : 'PATCH',
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/columns/${column.column_name}`,
	}, { manual: true });

	const onSubmit = async (values) => {
		const { name, cms_type, description } = values;
		const column_name = name;
		if (column.column_name) {
			try {
				await triggerUpdate({ data: { column_name, cms_type, description } });
				Toast.show({ message: 'Column edited successfully', intent: 'success' });
			} catch (error) {
				Toast.show({ message: `${error?.response?.data.message}`, intent: 'error' });
			}
		} else {
			try {
				await triggerCreate({ data: { column_name, cms_type, description } });
				Toast.show({ message: 'Column created successfully', intent: 'success' });
			} catch (error) {
				Toast.show({ message: `${error?.response?.data.message}`, intent: 'error' });
			}
		}
		onCreateSuccess(values);
	};

	const onError = () => {
		console.log({ errors });
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={handleSubmit(onSubmit, onError)}>

				<div className={styles.container}>
					<H3>
						{column ? 'Edit Column' : 'Add Column'}
					</H3>

					<FormGroup label="Name" labelFor="name">
						<ControlledInput id="name" name="name" />
					</FormGroup>

					<FormGroup label="Type" labelFor="cms_type">
						<ControlledSelect id="cms_type" name="cms_type" items={TYPE_OPTIONS} />
					</FormGroup>

					<FormGroup label="Description" labelFor="description">
						<ControlledTextarea id="description" name="description" />
					</FormGroup>

					<div style={{ textAlign: 'right' }}>
						<Button loading={loadingCreate || loadingUpdate} type="submit" text="Submit" />
					</div>

				</div>
			</form>
		</FormProvider>
	);
}

export default ColumnDetails;
