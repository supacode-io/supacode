import { DateInput2 } from '@blueprintjs/datetime2';
import { format, parse } from 'date-fns';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

function ControlledDatepicker({
	name,
	defaultValue = null,
	rules,
	...rest
}) {
	const { control } = useFormContext();
	const { field } = useController({
		name, control, defaultValue, rules,
	});
	return (
		<DateInput2
			formatDate={(date) => format(date, 'dd MMM yyyy | HH:mm:ss')}
			parseDate={(str) => parse(str, 'dd MMM yyyy | HH:mm:ss', new Date(str))}
			popoverProps={{
				placement: 'bottom-end',
			}}
			{...rest}
			{...field}

		/>
	);
}

export default ControlledDatepicker;
