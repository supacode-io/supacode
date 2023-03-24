import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { toastError, toastSuccess } from '@/ui/components/Toaster';

function AddContentModal({ selectedLocale, triggerContent, collection, show, onClose }) {
	const { register, reset, handleSubmit, formState: { errors } } = useForm();

	const router = useRouter();
	const { projectCode } = router.query;

	const [, triggercreate] = useCmsRequest({
		method : 'POST',
		params : { },
	}, { manual: true });
	const onSubmit = async (data) => {
		try {
			await triggercreate({
				url  : `/v1/${projectCode}/livewire/contents/${collection.code}/${data.key}`,
				data : { locale_code: selectedLocale, value: data.value },
			});
			await triggerContent({ params: { locale_code: selectedLocale } });
			toastSuccess('Content added successfully');
			reset();
			onClose();
		} catch (error) {
			toastError(error?.response?.data.message);
		}
	};

	return (

		<Dialog title="Add Data" isOpen={show} onClose={onClose}>
			<DialogBody>
				<form onSubmit={handleSubmit(onSubmit)}>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Key</label>
						</div>

						<div className={styles.input}>

							<input
								{...register('key', { required: true })}
								aria-invalid={errors.name ? 'true' : 'false'}

							/>
							{errors?.key && errors.key?.type === 'required'
							&& <div className={styles.error}>Please Enter Key</div>}
						</div>
					</div>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Value</label>
						</div>

						<div className={styles.input}>
							<textarea {...register('value', { required: true })} cols={50} rows={3} />
							{/* <input
								{...register('value', { required: true })}
							/> */}
							{errors?.value && errors.value?.type === 'required'
							&& <div className={styles.error}>Please Enter Value</div>}
						</div>
					</div>

				</form>
			</DialogBody>
			<DialogFooter
				actions={
					<Button type="submit" onClick={handleSubmit(onSubmit)}>Submit</Button>
				}
			/>
		</Dialog>
	);
}

export default AddContentModal;
