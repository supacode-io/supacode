import React from 'react';

import styles from './styles.module.css';

import { ControlledDatepicker, ControlledInput } from '@/external-packages/components';
import ControlledRTEditor from '@/external-packages/components/ControlledRTEditor';
import ControlledTextarea from '@/external-packages/components/ControlledTextarea';

const APPEARANCE_MAP = {
	id         : 'input_text',
	text       : 'input_text',
	long_text  : 'textarea',
	rich_text  : 'richtext_editor',
	list       : 'select',
	multi_list : 'multi_select',
	integer    : 'input_number',
	decimal    : 'input_number',
	serial     : 'input_number',
	timestamp  : 'datepicker',
	boolean    : 'switch',
	reference  : 'input_text',
	json       : 'textarea',
};

function FormControl({ id, column }) {
	const appearanceType = APPEARANCE_MAP[column?.cms_column?.cms_type] || APPEARANCE_MAP.text;
	const commonProps = { id, name: column.column_name, fill: true };

	switch (appearanceType) {
		case 'input_text':
			// if (column.column_name === 'content' || column.column_name === 'short-overview') {
			// 	return <ControlledTextarea {...commonProps} />;
			// }
			return <ControlledInput {...commonProps} />;
		case 'textarea':
			return <ControlledTextarea {...commonProps} />;
		case 'datepicker':
			return <ControlledDatepicker {...commonProps} />;
		case 'richtext_editor':
			return <ControlledRTEditor {...commonProps} />;
		default:
			return <p className={styles.not_supported}>Not Supported</p>;
	}
}

export default FormControl;
