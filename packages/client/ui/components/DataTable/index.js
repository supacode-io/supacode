import { useEffect } from 'react';
import {
	useAbsoluteLayout, useBlockLayout, useFlexLayout, useTable, useRowSelect,
} from 'react-table';

import styles from './styles.module.css';
import usePreparedColumns from './usePreparedColumns';
import usePreparedData from './usePreparedData';

import cl from '@/ui/helpers/classnames';

const layoutHooksMap = {
	absolute : [useAbsoluteLayout],
	block    : [useBlockLayout],
	flex     : [useFlexLayout],
	table    : [],
};

/**
 * @typedef {('table'|'flex'|'block'|'absolute')} LayoutType
 */

/**
 * Renders a Table Component
 * @param {Object}                    			props
 * @param {Object[]}                   			props.columns - Column definitions for the table
 * @param {Object[]}                   			props.data - Data to be rendered
 * @param {Object}                         	[props.style] - Inline style for the table
 * @param {string}                         	[props.className] - Classname for the table
 * @param {LayoutType}                     	[props.layoutType='table'] - CSS Properties to be used for rendering table
 * @param {('single'|'multiple'|null)}     	[props.selectType] - Enable single select or multi select
 * @param {function}                     	 	[props.onRowSelect=()=>{}] - Function trigger when selectType is set
 * @param {function}                     	 	[props.onRowClick=()=>{}] - Function trigger on clicking on row
 * @param {loading}                     	 	[props.loading=false] - Table Loading State
 * @param {getRowId}                     		[props.getRowId] - Determines row id
 */

function DataTable({
	className,
	style,
	columns: propColumns = [],
	data: propData = [],
	layoutType = 'table',
	selectType = null, // can be 'single' or 'multiple'
	onRowSelect = () => {},
	onRowClick = null,
	loading = false,
	getRowId,
	loadingRowsCount = 3,
}) {
	const layoutHooks = layoutHooksMap[layoutType] || [];
	const plugins = [...layoutHooks, useRowSelect];

	const { columns } = usePreparedColumns({ loading, columns: propColumns });
	const { data } = usePreparedData({ loading, data: propData, loadingRowsCount });
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		toggleAllRowsSelected,
		selectedFlatRows,
	} = useTable({
		columns,
		data,
		getRowId,
	}, ...plugins);

	useEffect(() => {
		const selectedRows = selectedFlatRows.map((r) => r?.original);
		if (selectType === 'single') {
			onRowSelect(selectedRows?.[0] || null);
		} else if (selectType === 'multiple') {
			onRowSelect(selectedRows);
		}
	}, [onRowSelect, selectType, selectedFlatRows]);

	return (
		<table
			{...getTableProps({
				className: cl`
					${styles.container}
					${cl.ns('table_container')}
					${className}
				`,
				style,
			})}
		>
			<thead
				className={cl`
					${styles.head_container}
					${cl.ns('table_head_container')}
				`}
			>
				{headerGroups.map((headerGroup) => (
					<tr {...headerGroup.getHeaderGroupProps({
						className: cl`
							${styles.head_row}
							${cl.ns('table_head_row')}
						`,
					})}
					>
						{headerGroup.headers.map((column) => (
							<th {...column.getHeaderProps({
								className: cl`
									${styles.head_cell}
									${cl.ns('table_head_cell')}
								`,
							})}
							>
								{column.render('Header')}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody
				{...getTableBodyProps({
					className: cl`
						${styles.body_container}
						${cl.ns('table_body_container')}`,
				})}
			>
				{rows.map((row) => {
					prepareRow(row);
					const rowProps = row.getRowProps([
						{
							onClick: () => {
								if (!loading) {
									if (typeof onRowClick === 'function') {
										onRowClick(row?.original);
									}
									if (selectType === 'single') {
										toggleAllRowsSelected(false);
										row.toggleRowSelected(!row.isSelected);
									} else if (selectType === 'multiple') {
										row.toggleRowSelected();
									}
								}
							},
							className: cl`
								${styles.body_row}
								${cl.ns('table_body_row')},
								${(selectType === 'single' || selectType === 'multiple' || onRowClick)
								? cl.ns('can_select')
								: ''}
								${row.isSelected ? cl.ns('selected') : ''}
							`,
						},
					]);
					return (
						<tr {...rowProps}>
							{row.cells.map((cell) => {
								const cellProps = cell.getCellProps({
									className: cl`
										${styles.body_cell}
										${cl.ns('table_body_cell')}
									`,
									// style     : cell.column.style,
								});
								return (
									<td {...cellProps}>
										{cell.render('Cell')}
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export default DataTable;
