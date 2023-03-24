import { Button, Dialog, DialogBody, DialogFooter, FormGroup } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import ControlledTextarea from '../../../../external-packages/components/ControlledTextarea';
import ControlledUploadarea from '../../../../external-packages/components/ControlledUploadarea';
import { useCmsRequest, useRequest } from '../../../../external-packages/request';

import ControlledInput from '@/external-packages/components/ControlledInput';
import { Toast } from '@/ui/components/Toaster';

function AddFileModal({ show, onClose, onComplete }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const methods = useForm({ defaultValues: {} });
	const { setValue, watch, handleSubmit } = methods;
	const watchFiles = watch('files');

	useEffect(() => {
		if (watchFiles) {
			setValue('name', watchFiles[0].name);
		} else {
			setValue('name', '');
		}
	}, [setValue, watchFiles]);

	const [{ loading: addLoading }, triggerAdd] = useCmsRequest({
		method : 'POST',
		url    : `/v1/${projectCode}/vault/files`,
	}, { manual: true });

	const [{ loading: uploadLoading }, triggerUpload] = useRequest({
		method: 'PUT',
	}, { manual: true });

	const onSubmit = async (values) => {
		try {
			const { name, description, files } = values;
			const response = await triggerAdd({ data: { name, description, mime_type: files[0].type } });
			const { urls } = response.data;
			await triggerUpload({
				url     : urls.writeUrl,
				data    : files[0],
				headers : {
					'Content-Type': files[0].type,
				},
			});
			methods.reset();
			onComplete();
			Toast.show({ message: 'File added successfully', intent: 'success' });
			onClose();
		} catch (err) {
			Toast.show({ message: err?.response?.data?.message || err.toString(), intent: 'danger' });
		}
	};

	const onError = (err) => {
		window.alert(`Error: ${err.toString()}`);
	};

	return (
		<Dialog title="Upload a file to Vault" isOpen={show} onClose={onClose}>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit, onError)}>
					<DialogBody>
						<FormGroup labelFor="files">
							<ControlledUploadarea rules={{ required: true }} multiple name="files" />
						</FormGroup>
						<FormGroup label="Name" labelFor="name">
							<ControlledInput placeholder="e.g. abc.jpg" fill name="name" />
						</FormGroup>
						<FormGroup label="Description" labelFor="description">
							<ControlledTextarea placeholder="Add a description" fill name="description" />
						</FormGroup>
					</DialogBody>
					<DialogFooter actions={(
						<Button
							intent="primary"
							loading={addLoading || uploadLoading}
							type="submit"
							text="Upload File"
						/>
					)}
					/>
				</form>
			</FormProvider>
		</Dialog>
	);
}

export default AddFileModal;
