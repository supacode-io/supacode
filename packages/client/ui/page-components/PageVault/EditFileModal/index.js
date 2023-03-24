import { Dialog, DialogBody, H3, Button, Toast } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ControlledTextarea from '../../../../external-packages/components/ControlledTextarea';
import { useCmsRequest } from '../../../../external-packages/request';

import styles from './styles.module.css';

import ControlledInput from '@/external-packages/components/ControlledInput';
import FormAction from '@/ui/components/FormAction';
import FormItem from '@/ui/components/FormItem';

function EditFileModal({ editFile, show, onClose, onComplete }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const methods = useForm({ defaultValues: {} });
	const { register, setValue, handleSubmit, formState:{ errors } } = methods;

	useEffect(() => {
		if (editFile) {
			setValue('name', editFile.name);
			setValue('description', editFile.description);
		} else {
			setValue('name', '');
		}
	}, [setValue, editFile]);

	const [{ loading: editing }, triggerUpdate] = useCmsRequest({
		method : 'PATCH',
		url    : `/v1/${projectCode}/vault/files/${editFile?.id}`,
	}, { manual: true });

	const onSubmit = async (values) => {
		try {
			const { name, description } = values;
			// eslint-disable-next-line no-unused-vars
			const response = await triggerUpdate({ data: { name, description } });
			methods.reset();
			onComplete();

			Toast.show({ message: 'File renamed.', intent: 'success' });

			onClose();
		} catch (err) {
			Toast.show({ message: err?.response?.data?.message || err.toString(), intent: 'danger' });
		}
	};

	// eslint-disable-next-line no-unused-vars
	const onError = (err) => {
		// window.alert(`Error: ${err.toString()}`);
	};

	return (
		<Dialog isOpen={show} onClose={onClose}>
			<DialogBody>
				<H3>Rename File</H3>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit(onSubmit, onError)}>
						<FormItem label="File Name" labelFor="name">
							<ControlledInput name="name" {...register('name', { required: true })} />
							{(errors?.name && errors?.name?.type === 'required') && (
								<p className={styles.error_message}>
									Name is required
								</p>
							)}
						</FormItem>
						<FormItem label="File Description" labelFor="description">
							<ControlledTextarea name="description" />
						</FormItem>
						<FormAction>
							<Button intent="primary" loading={editing} type="submit">Submit</Button>
						</FormAction>
					</form>
				</FormProvider>
			</DialogBody>
		</Dialog>
	);
}

export default EditFileModal;
