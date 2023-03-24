import { Button, Classes } from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import { Cell, Column, JSONFormat2, Table2, TruncatedFormat2, TableLoadingOption, ColumnHeaderCell2 } from '@blueprintjs/table';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import AddRowModal from '../AddRowModal';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import Actionbar from '@/ui/components/Actionbar';
import { Pagination } from '@/ui/components/Pagination';
import { addDatastoreActiveTab } from '@/ui/store/datastore/tabview-slice';

function TableView({ tableName }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const [search, setSearch] = useState('');

	const [showAdd, setShowAdd] = useState(false);
	const limit = 100;
	const [page, setPage] = useState(1);

	const dispatch = useDispatch();

	const params = { limit, offset: (page - 1) * limit };

	if (search) {
		params.q = search;
	}

	const [{ data: resData, loading: resLoading }, triggerList] = useCmsRequest({
		url: `/v1/${projectCode}/datastore/tables/${tableName}/rows`,
		params,
	}, { manual: !tableName });

	// eslint-disable-next-line no-unused-vars
	const [{ data: columnData }, trigger] = useCmsRequest({
		url    : `/v1/${projectCode}/datastore/tables/${tableName}/columns`,
		params : { limit: 100 },
	}, { manual: !tableName });

	// const [, triggerDelete] = useCmsRequest({
	// 	method: 'DELETE',
	// }, { manual: true });

	const data = resData?.rows || [];
	const columns = columnData?.columns || [];
	// const columns = Object.keys(data?.[0] || {}).map((column) => ({
	// 	Header   : column,
	// 	accessor : (row) => (typeof row[column] === 'object'
	// 		? <pre className={styles.pre_code}>{JSON.stringify(row[column])}</pre>
	// 		: row[column]),
	// 	id    : column,
	// 	width : 200,
	// }));

	// const handleClickOnEdit = (row) => {
	// 	dispatch(addDatastoreActiveTab({
	// 		id        : `edit-row-${tableName}-${row._id}`,
	// 		name      : `Edit Row: ${row._id}`,
	// 		component : 'EditRowView',
	// 		props     : { tableName, rowId: row._id },
	// 	}));
	// };
	// const handleClickOnDelete = async (row) => {
	// 	const res = window.confirm('Are you sure you want to delete?');
	// 	if (res) {
	// 		await triggerDelete({ url: `/v1/${projectCode}/datastore/tables/${tableName}/rows/${row._id}` });
	// 		await triggerList();
	// 	}
	// };

	// columns.unshift({
	// 	Header   : 'Actions',
	// 	accessor : (row) => (
	// 		<div className={styles.actions}>
	// 			<Button onClick={() => handleClickOnEdit(row)}><IcMEdit /></Button>
	// 			<Button onClick={() => handleClickOnDelete(row)}><IcMDelete /></Button>
	// 		</div>
	// 	),
	// 	id: '_actions',
	// });

	const handleClickOnColumns = () => {
		dispatch(addDatastoreActiveTab({
			id        : `columns-${tableName}`,
			name      : `Columns: ${tableName}`,
			component : 'ColumnsView',
			props     : { tableName },
		}));
	};
	// const handleOptionsChange = (value) => {
	// 	setSelectedOption(value);
	// };

	const loadingOptions = useMemo(() => {
		if (resLoading) {
			return [
				TableLoadingOption.CELLS,
				TableLoadingOption.ROW_HEADERS,
			];
		}
		return [];
	}, [resLoading]);

	return (
		<>
			<Actionbar
				style={{ backgroundColor: '#fff', padding: 10 }}
				showSearch
				searchProps={{
					placeholder : `Search rows in "${tableName}"`,
					onChange    : (s) => setSearch(s),
					value       : search,
				}}
				buttons={(
					<>
						<Button
							icon="plus"
							text="Add Row"
							intent="primary"
							style={{ marginRight: 10 }}
							onClick={() => setShowAdd(true)}
						/>
						<Button icon="column-layout" text="View Columns" onClick={handleClickOnColumns} />
					</>
				)}
				extras={(
					<Pagination
						currentPage={page}
						totalItems={resData?.total || 0}
						pageSize={limit}
						onPageChange={(p) => { setPage(p); }}
					/>
				)}
			/>
			<div className={styles.table_container}>
				{/* <Table layoutType="flex" columns={columns} data={data} /> */}
				<Table2
					numRows={data?.length}
					loadingOptions={loadingOptions}
				>
					{columns.map((c) => (
						<Column
							key={c.column_name}
							name={c.column_name}
							cellRenderer={(i) => {
								let item = data[i][c.column_name];
								if (item && c.cms_column.cms_type === 'timestamp') {
									item = (
										<pre className={styles.pre_code}>
											<TruncatedFormat2 detectTruncation>
												{format(new Date(item), 'MMM dd, yyyy / hh:mm:ss a')}
											</TruncatedFormat2>
										</pre>
									);
								} else if (item && c.cms_column.cms_type === 'json') {
									item = <JSONFormat2 detectTruncation>{item}</JSONFormat2>;
								}
								return <Cell>{item}</Cell>;
							}}
							columnHeaderCellRenderer={(i) => {
								const column = columns[i];
								return (
									<ColumnHeaderCell2
										name={column.column_name}
										index={i}
										menuIcon="caret-down"
										menuRenderer={() => (
											<MenuItem2 text="Edit" />
										)}
									/>
								);
							}}
						/>
					))}
				</Table2>
			</div>
			<AddRowModal
				tableName={tableName}
				show={showAdd}
				triggerList={triggerList}
				onClose={() => setShowAdd(false)}
			/>
		</>
	);
}

export default TableView;
