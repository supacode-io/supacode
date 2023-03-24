import { FormGroup, Icon } from '@blueprintjs/core';
import { startCase } from 'lodash';
import React from 'react';

import FormControl from './FormControl';
import styles from './styles.module.css';

// import FormItem from '@/ui/components/FormItem';

const iconMapping = {
	text      : 'new-text-box',
	long_text : 'new-text-box',
	number    : 'numerical',
	timestamp : 'calendar',
	rich_text : 'style',
	reference : 'many-to-one',
	json      : 'array',

};

function FormLayout({ columns = [] }) {
	return (
		<div>
			{columns.map(((column) => (
				<FormGroup
					label={(
						<span>{startCase(column.column_name)}</span>
					)}
					labelInfo={column.is_required ? '*' : ''}
					subLabel={(
						<span>
							<Icon
								htmlTitle={column.cms_column.cms_type}
								className={styles.label_icon}
								color="#5f6b7c"
								icon={iconMapping[column.cms_column.cms_type]}
							/>
							Column:&nbsp;
							<strong>{column.column_name}</strong>
						</span>
					)}
					labelFor={`control-${column.column_name}`}
					// inline
					// contentClassName={styles.content_inline}
				>
					{/* {console.log(column)} */}
					<FormControl id={`control-${column.column_name}`} column={column} />
				</FormGroup>
			)))}
		</div>
	);
}

export default FormLayout;
