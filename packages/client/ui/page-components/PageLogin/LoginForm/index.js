import { Button } from '@blueprintjs/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';

import { ControlledInput } from '@/external-packages/components';
import { useCmsRequest } from '@/external-packages/request';
import FormItem from '@/ui/components/FormItem';
import { toastError } from '@/ui/components/Toaster';
import { setSession } from '@/ui/store/auth';

function LoginForm() {
	const auth = useSelector((s) => s.auth);

	const methods = useForm({
		defaultValues: { email: '', password: '' },
	});

	const [{ loading, error }, trigger] = useCmsRequest({
		method : 'POST',
		url    : 'v1/auth/login',
	}, { manual: true });

	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		if (error) {
			toastError(error?.response?.data.message);
		}
	}, [error]);

	useEffect(() => {
		if (auth.sessionId && auth.session) {
			router.push('/');
		}
	}, [auth.session, auth.sessionId, router]);

	const onSubmit = methods.handleSubmit(async (values) => {
		const { email, password } = values;
		const body = { email, password };
		const res = await trigger({ data: body });
		const { session, sessionId } = res?.data || {};
		if (sessionId && session) {
			Cookies.set('sess_token', sessionId);
			dispatch(setSession({ sessionId, session }));
		}
	});

	return (
		<div className={styles.container}>
			<div className={styles.formhead}>
				Add details to login below
			</div>
			<FormProvider {...methods} className={styles.formstart}>
				<form onSubmit={onSubmit}>
					<FormItem label="Email" labelFor="email" className={styles.items}>
						<ControlledInput
							className={styles.inputstyle}
							id="email"
							name="email"
							rules={{ required: true }}
						/>
					</FormItem>
					<FormItem label="Password" labelFor="password" className={styles.items}>
						<ControlledInput
							className={styles.inputstyle}
							id="password"
							name="password"
							type="password"
							rules={{ required: true }}
						/>
					</FormItem>
					<FormItem className={styles.items}>
						<Button loading={loading} fill type="submit">Login</Button>
					</FormItem>
				</form>
			</FormProvider>
		</div>
	);
}

export default LoginForm;
