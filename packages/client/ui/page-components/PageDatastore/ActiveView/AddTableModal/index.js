import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import { snakeCase } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { toastError, toastSuccess } from '@/ui/components/Toaster';

function AddTableModal({ setIsTableCreated, show, onClose }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const { register, handleSubmit, setValue, formState: { errors } } = useForm();

	const [, triggerCreate] = useCmsRequest({
		method : 'POST',
		url    : `/v1/${projectCode}/datastore/tables`,
	}, { manual: true });

	const onSubmit = async (data) => {
		const table_data = {
			table_name  : data.table_name,
			description : data.description,
		};

		setIsTableCreated(false);
		try {
			await triggerCreate({ data: table_data });
			setIsTableCreated(true);
			setValue('table_name', '');
			setValue('description', '');
			onClose();
			toastSuccess('Table Created Successfully');
		} catch (error) {
			toastError(error?.response?.data.message);
		}
	};

	return (

		<Dialog isOpen={show} title="Add Table" onClose={onClose}>
			<DialogBody>
				<form onSubmit={handleSubmit(onSubmit)}>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Table Name</label>
						</div>

						<div className={styles.input}>

							<input
								{...register('table_name', { required: true })}
								onChange={(e) => { setValue('name', e.target.value); }}
								aria-invalid={errors.table_name ? 'true' : 'false'}

							/>
							{errors?.name && errors.name?.type === 'required'
							&& <div className={styles.error}>Please Enter Project Name</div>}
						</div>
					</div>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Description</label>
						</div>

						<div className={styles.input}>
							<textarea
								cols={50}
								rows={4}
								{...register('description', { required: false })}
								onChange={(e) => { setValue('description', snakeCase(e.target.value)); }}
								aria-invalid={errors.description ? 'true' : 'false'}
							/>
						</div>
					</div>

				</form>
			</DialogBody>
			<DialogFooter
				actions={(
					<Button
						intent="primary"
						type="submit"
						onClick={handleSubmit(onSubmit)}
					>
						Submit

					</Button>
				)}
			/>
		</Dialog>
	);
}

export default AddTableModal;
