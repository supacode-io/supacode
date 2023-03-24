import { Button, Classes, Divider, Icon } from '@blueprintjs/core';
import React, { forwardRef, Fragment } from 'react';
import { useDropzone } from 'react-dropzone';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';

const iconProps = { size: 20, color: 'rgb(17 20 24 / 15%)' };

function FileIcon({ mimeType }) {
	const [type] = mimeType.split('/');
	switch (type) {
		case 'image':
			return <Icon {...iconProps} icon="media" />;
		default:
			return <Icon {...iconProps} icon="document" />;
	}
}

function Uploadarea({
	className,
	value,
	onChange,
	onBlur,
	name,
	multiple = false,
	accept,
}, ref) {
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => onChange(acceptedFiles),
		multiple,
		accept,
	});

	const handleClickOnClearAll = (e) => {
		e.stopPropagation();
		onChange();
	};

	const handleClickOnClear = (index) => {
		let newValue = [...Array.from(value || [])];
		newValue.splice(index, 1);
		if (newValue?.length < 1) {
			newValue = undefined;
		}
		onChange(newValue);
	};

	return (
		<div {...getRootProps({
			className: cl`
                ${className}
                ${styles.container}
            `,
		})}
		>
			{(!value || value?.length < 1) && (
				<div className={styles.inner_container}>
					<input {...getInputProps({ name, ref, onBlur })} />
					<div className={styles.droparea}>
						<Icon size={30} color="rgb(17 20 24 / 15%)" icon="cloud-upload" />
						<p className={Classes.TEXT_MUTED}>
							Drag & drop a file here, or click to
							{' '}
							<strong>select a file</strong>
						</p>
					</div>
				</div>
			)}
			{(value && value?.length > 0) && (
				<div className={styles.file_list_container}>
					{(value || []).map((file, index) => (
						<Fragment key={file.path}>
							{index !== 0 ? <Divider /> : null}
							<div className={styles.file_container}>
								<FileIcon mimeType={file.type} />
								<p className={styles.filepath_text}>
									{file.path}
								</p>
								<Button
									small
									minimal
									onClick={(e) => {
										e.stopPropagation();
										handleClickOnClear(index);
									}}
									icon="cross"
									type="button"
								/>
							</div>
						</Fragment>
					))}
				</div>
			)}
			{(value && value?.length > 0) && (
				<Button
					style={{ top: 2, right: 2 }}
					small
					minimal
					className={styles.corner_button}
					type="button"
					onClick={handleClickOnClearAll}
				>
					Clear All
				</Button>
			)}
		</div>
	);
}

export default forwardRef(Uploadarea);
