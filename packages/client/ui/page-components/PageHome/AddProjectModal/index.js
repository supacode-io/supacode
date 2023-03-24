import { Button, Dialog, DialogBody, DialogFooter, H2 } from '@blueprintjs/core';
import { snakeCase } from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { Toast } from '@/ui/components/Toaster';

function AddProjectModal({ setAdded, show, onClose }) {
	const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();

	const [, triggercreate] = useCmsRequest({
		method : 'POST',
		url    : '/v1/projects',
		params : { },
	}, { manual: true });
	const onSubmit = async (data) => {
		setAdded(false);
		try {
			await triggercreate({ data });
			setAdded(true);
			reset();
			onClose();
			Toast.show({ message: 'Project added successfully.', intent: 'success' });
		} catch (error) {
			Toast.show({ message: `${error?.response?.data.message}.`, intent: 'danger' });
		}
	};

	return (

		<Dialog isOpen={show} onClose={onClose} isCloseButtonShown>
			<DialogBody>
				<H2>Create Project</H2>
				<form onSubmit={handleSubmit(onSubmit)}>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Project Name</label>
						</div>

						<div className={styles.input}>

							<input
								{...register('name', { required: true })}
								onChange={(e) => {
									setValue('name', e.target.value);
									setValue('code', snakeCase(e.target.value));
								}}
								aria-invalid={errors.name ? 'true' : 'false'}

							/>
							{errors?.name && errors.name?.type === 'required'
							&& <div className={styles.error}>Please Enter Project Name</div>}
						</div>
					</div>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Code Name</label>
						</div>

						<div className={styles.input}>
							<input
								name="code"
								readOnly
								disabled
								{...register('code')}
							/>
						</div>
					</div>

				</form>
			</DialogBody>
			<DialogFooter actions={
				<Button intent="primary" type="submit" onClick={handleSubmit(onSubmit)}>Create</Button>
			}
			/>
		</Dialog>
	);
}

export default AddProjectModal;
