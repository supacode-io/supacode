import React, { forwardRef } from 'react';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';

function Textarea(
	{
		id,
		className,
		style,
		name,
		onChange = () => {},
		onBlur = () => {},
		value,
		defaultValue,
		placeholder,
		disabled,
		required,
		readOnly,
		rows,
		autoFocus,
	},
	ref,
) {
	return (
		<div
			id={id}
			style={style}
			className={cl`
				${className}
				${styles.container}
				${cl.ns('input_container')}
			`}
		>
			<textarea
				ref={ref}
				className={cl`
					${className}
					${styles.control}
					${cl.ns('input_control')}
				`}
				name={name}
				type="text"
				onChange={(e) => onChange(e.target.value)}
				onBlur={(e) => onBlur(e)}
				defaultValue={defaultValue}
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				required={required}
				readOnly={readOnly}
				rows={rows}
				autoFocus={autoFocus}
			/>
		</div>
	);
}

export default forwardRef(Textarea);
