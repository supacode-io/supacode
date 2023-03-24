import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

function Editusers({ triggerlist, userdata, show, onClose }) {
	const { register, handleSubmit, setValue, formState: { errors } } = useForm();
	const [, triggerupdate] = useCmsRequest({
		method : 'PATCH',
		url    : `/v1/users/${userdata[0].id}`,
	}, { manual: true });
	useEffect(() => {
		setValue('name', userdata[0].name);
		setValue('email', userdata[0].email);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (data) => {
		try {
			await triggerupdate({ data });
			window.confirm('user Updated Successfully');
		} catch (error) {
			window.alert(error?.response?.data?.message);
		}
		triggerlist();
		onClose();
	};
	return (
		<div>
			<Dialog title="Update User" isOpen={show} onClose={onClose} size="lg">
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
									type="email"
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
								{errors?.name && errors.name?.type === 'required'
			&& <div className={styles.error}>Please Enter Name</div>}
							</div>
						</div>

					</form>
				</DialogBody>
				<DialogFooter>
					<Button type="submit" onClick={handleSubmit(onSubmit)}>Update user</Button>
				</DialogFooter>
			</Dialog>

		</div>
	);
}

export default Editusers;
