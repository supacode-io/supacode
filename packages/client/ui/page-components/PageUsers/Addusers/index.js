import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { toastError, toastSuccess } from '@/ui/components/Toaster';

function Addusers({ triggerlist, show, onClose }) {
	const { register, reset, handleSubmit, formState: { errors } } = useForm();
	const [, triggercreate] = useCmsRequest({
		method : 'POST',
		url    : '/v1/users',
	}, { manual: true });
	const onSubmit = async (data) => {
		try {
			await triggercreate({ data });
			toastSuccess('User added successfully');
			triggerlist();
			reset();
			onClose();
		} catch (error) {
			toastError(error?.response?.data.message);
		}
	};
	return (
		<div>
			<Dialog title="Add User" show={show} onClose={onClose} size="lg">
				<DialogBody>
					<form onSubmit={handleSubmit(onSubmit)}>

						<div className={styles.form}>
							<div className={styles.label}>
								<label>User Name</label>
							</div>

							<div className={styles.input}>

								<input
									{...register('name', { required: true })}
									aria-invalid={errors.name ? 'true' : 'false'}
								/>
								{errors?.name && errors.name?.type === 'required'
            && <div className={styles.error}>Please Enter Name</div>}
							</div>
						</div>
						<div className={styles.form}>
							<div className={styles.label}>
								<label>User Email</label>
							</div>

							<div className={styles.input}>

								<input
									{...register('email', {
										required : true,
										pattern  : {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										},
									})}
									aria-invalid={errors.name ? 'true' : 'false'}
								/>
								{errors?.email && errors.email?.type === 'required'
            && <div className={styles.error}>Please Enter Email</div>}
								{errors?.email && errors.email?.type === 'pattern'
			&& <div className={styles.error}>Invalid Email</div>}
							</div>
						</div>
						<div className={styles.form}>
							<div className={styles.label}>
								<label>Password</label>
							</div>

							<div className={styles.input}>

								<input
									{...register('password', { required: true })}
									aria-invalid={errors.name ? 'true' : 'false'}
								/>
								{errors?.password && errors.password?.type === 'required'
            && <div className={styles.error}>Please Enter Password</div>}
							</div>
						</div>

					</form>
				</DialogBody>
				<DialogFooter
					actions={
						<Button type="submit" onClick={handleSubmit(onSubmit)}>Add user</Button>
					}
				/>
			</Dialog>

		</div>
	);
}

export default Addusers;
