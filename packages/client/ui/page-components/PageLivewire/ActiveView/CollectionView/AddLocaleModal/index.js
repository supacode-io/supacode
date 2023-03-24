import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

function AddLocaleModal({ triggerLocale, show, onClose }) {
	const { register, handleSubmit, formState: { errors } } = useForm();

	const router = useRouter();
	const { projectCode } = router.query;

	const [, triggercreate] = useCmsRequest({
		method : 'POST',
		params : { },
	}, { manual: true });
	const onSubmit = async (data) => {
		try {
			await triggercreate({
				url  : `/v1/${projectCode}/livewire/locales`,
				data : { locale_code: data.locale },
			});
			await triggerLocale();
			onClose();
		} catch (error) {
			console.log(error);
			window.alert(error?.response?.data?.message);
		}
	};

	return (

		<Dialog isOpen={show} onClose={onClose} title="Add Data">
			<DialogBody>
				<form onSubmit={handleSubmit(onSubmit)}>

					<div className={styles.form}>
						<div className={styles.label}>
							<label>Locale</label>
						</div>

						<div className={styles.input}>

							<input
								{...register('locale', { required: true })}
								aria-invalid={errors.name ? 'true' : 'false'}

							/>
							{errors?.locale && errors.locale?.type === 'required'
							&& <div className={styles.error}>Please Enter Locale</div>}
						</div>
					</div>

				</form>
			</DialogBody>
			<DialogFooter>
				<Button type="submit" onClick={handleSubmit(onSubmit)}>Submit</Button>
			</DialogFooter>
		</Dialog>
	);
}

export default AddLocaleModal;
