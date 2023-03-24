import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

function ControlledForm({
	defaultValues = {},
	onSubmit = () => {},
	onError = () => {},
	children = null,
}) {
	const methods = useForm({ defaultValues });
	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit, onError)}>
				{children}
			</form>
		</FormProvider>
	);
}

export default ControlledForm;
