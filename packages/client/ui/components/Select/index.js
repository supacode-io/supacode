import { Button } from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import { Suggest2 } from '@blueprintjs/select';
import React, { useMemo, forwardRef } from 'react';

const initialItems = [];

function Select({
	name,
	defaultValue = null,
	labelKey = 'label',
	valueKey = 'value',
	onBlur,
	onChange,
	value,
	items = initialItems,
	...rest
}, ref) {
	console.log({ items });

	const handleChange = (hydratedValue) => {
		onChange(hydratedValue?.[valueKey]);
	};

	const hydratedValue = useMemo(
		() => items.find((item) => (item?.[valueKey] === value)),
		[items, value, valueKey],
	);

	return (
		<Suggest2
			fill
			defaultValue={defaultValue}
			ref={ref}
			items={items}
			onItemSelect={handleChange}
			selectedItem={hydratedValue}
			inputProps={{
				onBlur,
				rightElement: (
					<Button small minimal icon="caret-down" />
				),
			}}
			itemsEqual={(a, b) => a[valueKey] === b[valueKey]}
			itemRenderer={(item, { handleClick, handleFocus, modifiers, ref: itemRef }) => {
				if (!modifiers.matchesPredicate) {
					return null;
				}
				return (
					<MenuItem2
						active={modifiers.active}
						disabled={modifiers.disabled}
						elementRef={itemRef}
						key={item[valueKey]}
						label={item[valueKey]}
						onClick={handleClick}
						onFocus={handleFocus}
						roleStructure="listoption"
						text={item[labelKey]}
					/>
				);
			}}
			itemPredicate={(query, item, _index, exactMatch) => {
				const normalizedItem = item[labelKey].toLowerCase();
				const normalizedQuery = query.toLowerCase();

				if (exactMatch) {
					return normalizedItem === normalizedQuery;
				}
				return `${item[labelKey]} ${normalizedItem} ${item[valueKey]}`.indexOf(normalizedQuery) >= 0;
			}}
			inputValueRenderer={(item) => item[labelKey]}
			popoverProps={{
				placement        : 'bottom-end',
				matchTargetWidth : true,
				minimal          : true,
			}}
			resetOnClose
			{...rest}
		/>
	);
}

export default forwardRef(Select);
