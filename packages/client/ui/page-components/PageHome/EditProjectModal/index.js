import { Button, Dialog, DialogBody, DialogFooter, H2 } from '@blueprintjs/core';
import { snakeCase } from 'lodash';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { Toast } from '@/ui/components/Toaster';

function EditProjectModal({ setEdited, show, onClose, projectData }) {
	const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();

	useEffect(() => {
		setValue('name', projectData?.name);
		setValue('code', projectData?.code);
	}, [projectData, setValue]);

	const [, triggerUpdate] = useCmsRequest({
		method : 'PATCH',
		url    : `/v1/projects/${projectData?.id}`,
		params : { },
	}, { manual: true });
	const onSubmit = async (data) => {
		setEdited(false);
		try {
			await triggerUpdate({ data });
			setEdited(true);
			reset();
			onClose();
			Toast.show({ message: 'Project renamed.', intent: 'success' });
		} catch (error) {
			Toast.show({ message: `${error?.response?.data.message}.`, intent: 'danger' });
		}
	};
	return (

		<Dialog isOpen={show} onClose={onClose}>
			<DialogBody>
				<H2>Edit project</H2>
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
								id="name"
								name="name"
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
			<DialogFooter
				actions={
					<Button intent="primary" type="submit" onClick={handleSubmit(onSubmit)}>Submit</Button>
				}
			/>
		</Dialog>
	);
}

export default EditProjectModal;
