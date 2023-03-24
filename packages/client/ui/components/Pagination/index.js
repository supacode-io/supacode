import { Button, ButtonGroup } from '@blueprintjs/core';
import React from 'react';

import cl from '@/ui/helpers/classnames';

const CELL_COUNT = 7;

function pagingCells(n, pos, maxCells = CELL_COUNT) {
	// Consider an array of pages with length `n`. Let `p` be currentPage position.
	//  [1, 2, 3, ..., n-1, n]
	//
	// Requirements:
	// - In all cases we want to keep `1` and `n` visible.
	// - We cant render more than CELL_COUNT items.
	// - If the cells exceed CELL_COUNT, insert `...` wherever appropriate.
	const offset = n - pos;
	// eslint-disable-next-line no-bitwise
	const pivot = ~~(maxCells / 2);

	const cells = [];

	if (n > maxCells) {
		// Fill in first and last positions
		cells[0] = { nr: 1 };
		cells[1] = { nr: 2 };
		cells[maxCells - 2] = { nr: n - 1 };
		cells[maxCells - 1] = { nr: n };

		if (pos <= pivot) {
			// last ellipse is enabled and the rest of the array is filled
			cells[maxCells - 2].ellipsis = true;
			for (let i = 2; i < maxCells - 2; i += 1) {
				cells[i] = { nr: i + 1 };
			}
		} else if (offset < pivot) {
			// a ellipsis is enabled and the later part of array is filled
			cells[1].ellipsis = true;
			for (let i = 2; i < maxCells - 2; i += 1) {
				cells[i] = { nr: n - maxCells + i + 1 };
			}
		} else {
			// both a and b ellipsis are enabled
			cells[1].ellipsis = true;
			cells[maxCells - 2].ellipsis = true;

			// Current selected is put in centre
			// cells[pivot] = { nr: pos };
			// Fill next and prev to mid point
			const pivotIndex = 2 + Math.floor((maxCells - 4) / 2);

			for (let i = 2; i < maxCells - 2; i += 1) {
				const diff = i - pivotIndex;
				cells[i] = { nr: pos + diff };
			}
		}
	} else {
		for (let i = 0; i < n; i += 1) {
			cells[i] = { nr: i + 1, ellipsis: false };
		}
	}
	return cells;
}

// Renders a Pagination Button Group, inserting ellipsis based on currentPage.
// ┌───┬───┬───┬───┬───┐
// │ < │ 1 │ 2 │ 3 │ > │
// └───┴───┴───┴───┴───┘
// ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐
// │ < │ 1 │ 2 │ 3 │ 4 │...│ 9 │10 │ > │
// └───┴───┴───┴───┴───┴───┴───┴───┴───┘
// ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐
// │ < │ 1 │...│ 4 │ 5 │ 6 │...│10 │ > │
// └───┴───┴───┴───┴───┴───┴───┴───┴───┘

export function Pagination({ totalItems, currentPage, onPageChange, pageSize = 10, maxCells = 7 }) {
	const totalPages = Math.ceil(totalItems / pageSize);

	const prev = (
		<Button
			minimal
			icon="chevron-left"
			disabled={currentPage <= 1}
			onClick={() => onPageChange(currentPage - 1)}
		/>
	);

	const next = (
		<Button
			minimal
			rightIcon="chevron-right"
			disabled={currentPage >= totalPages}
			onClick={() => onPageChange(currentPage + 1)}
		/>
	);

	return (
		<ButtonGroup className={cl`${cl.ns('pagination_container')}`}>
			{prev}
			{pagingCells(totalPages, currentPage, maxCells).map(({ nr, ellipsis }) => (
				<Button
					minimal
					text={!ellipsis && nr}
					icon={ellipsis && 'more'}
					disabled={ellipsis}
					key={nr}
					active={nr === currentPage}
					intent={nr === currentPage ? 'primary' : 'none'}
					onClick={() => onPageChange(nr)}
				/>
			))}
			{next}
		</ButtonGroup>
	);
}
