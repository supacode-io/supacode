import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import { snakeCase } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { toastError, toastSuccess } from '@/ui/components/Toaster';

function AddCollectionModal({ triggerList, show, onClose }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm();

	const [, triggercreate] = useCmsRequest({
		method : 'POST',
		url    : `/v1/${projectCode}/livewire/collections`,
		params : { },
	}, { manual: true });
	const onSubmit = async (data) => {
		try {
			await triggercreate({ data });
			toastSuccess('Collection created successfully.');
			reset();
			triggerList();
			onClose();
		} catch (error) {
			toastError(error?.response?.data.message);
		}
	};

	return (

		<Dialog title="Add Collection" isOpen={show} onClose={onClose} size="lg">
			<DialogBody>
				<form onSubmit={handleSubmit(onSubmit)}>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Collection Name</label>
						</div>

						<div className={styles.input}>

							<input
								{...register('name', { required: true })}
								onChange={(e) => { setValue('code', snakeCase(e.target.value)); }}
								aria-invalid={errors.name ? 'true' : 'false'}

							/>
							{errors?.name && errors.name?.type === 'required'
							&& <div className={styles.error}>Please Enter Collection Name</div>}
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
				actions={(
					<Button intent="primary" type="submit" onClick={handleSubmit(onSubmit)}>Submit</Button>
				)}
			/>
		</Dialog>
	);
}

export default AddCollectionModal;
