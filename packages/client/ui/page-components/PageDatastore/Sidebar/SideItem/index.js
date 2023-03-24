import { Button, Menu, MenuDivider } from '@blueprintjs/core';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { removeDatastoreTab, addDatastoreActiveTab } from '@/ui/store/datastore/tabview-slice';

function SideItem({ triggerList, table }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const { activeTabId } = useSelector((state) => state.datastore.tabview);

	const dispatch = useDispatch();
	const router = useRouter();
	const { projectCode } = router.query;

	const handleClickTable = (e) => {
		e.stopPropagation();
		dispatch(addDatastoreActiveTab({
			id        : `table-${table.table_name}`,
			name      : `Table: ${table.table_name}`,
			component : 'TableView',
			props     : { tableName: table.table_name },
		}));
		setMenuOpen(false);
	};

	const handleClickColumns = (e) => {
		e.stopPropagation();
		dispatch(addDatastoreActiveTab({
			id        : `columns-${table.table_name}`,
			name      : `Columns: ${table.table_name}`,
			component : 'ColumnsView',
			props     : { tableName: table.table_name },
		}));
		setMenuOpen(false);
	};

	const [, triggerDelete] = useCmsRequest({
		method : 'delete',
		url    : `/v1/${projectCode}/datastore/tables/${table.table_name}`,
	}, { manual: true });

	const handleDelete = async () => {
		const res = window.confirm('Are you sure you want to delete the table?');
		if (res) {
			await triggerDelete();
			await triggerList();
			dispatch(removeDatastoreTab(`columns-${table.table_name}`));
			dispatch(removeDatastoreTab(`table-${table.table_name}`));
		}
	};

	return (
		<MenuItem2
			tagName="div"
			className={styles.item}
			text={table.table_name}
			icon="th"
			active={[`table-${table.table_name}`, `columns-${table.table_name}`].includes(activeTabId)}
			onClick={handleClickTable}
			labelElement={(
				<Popover2
					isOpen={menuOpen}
					onInteraction={(s, e) => {
						if (e) {
							e.stopPropagation();
						}
						setMenuOpen(s);
					}}
					content={(
						<Menu>
							<MenuItem2
								onClick={handleClickColumns}
								icon="column-layout"
								text="View Columns"
							/>
							<MenuDivider />
							<MenuItem2
								intent="danger"
								onClick={handleDelete}
								icon="trash"
								text="Delete Table"
							/>
						</Menu>
					)}
					placement="bottom-start"
				>
					<Button
						className={styles.more_button}
						icon="more"
						small
						minimal
						style={{ minHeight: 15 }}
					/>
				</Popover2>
			)}
		/>
	// <li
	// 	key={table.table_name}
	// 	className={cl`
	//         ${styles.list_item}
	//         ${isItemExpanded ? styles.expanded : ''}
	//     `}
	// 	style={{
	// 		fontWeight : isActiveTable ? '600' : '',
	// 		color      : isActiveTable ? '#2c3e50' : '',
	// 	}}
	// >
	// 	<div
	// 		className={styles.list_item_inner}
	// 		role="button"
	// 		tabIndex={0}
	// 		onClick={() => handleClick(table)}
	// 	>
	// 		<div>
	// 			<IcMArrowRotateRight className={styles.arrow_rotate} />
	// 			<span>{table.table_name}</span>
	// 		</div>
	// 		<div role="presentation" onClick={handleDelete}>
	// 			<IcMDelete />
	// 		</div>
	// 	</div>
	// 	{isItemExpanded ? (
	// 		<ul className={styles.sub_list}>
	// 			<li className={styles.sub_item}>
	// 				<div
	// 					role="button"
	// 					tabIndex={0}
	// 					className={styles.sub_item_inner}
	// 					onClick={handleClickTable}
	// 					style={{
	// 						fontWeight : (isActiveTable && isRowActive) ? '550' : '400',
	// 						color      : (isActiveTable && isRowActive) ? '#2c3e50' : 'black',
	// 					}}
	// 				>
	// 					<span>Table Rows</span>
	// 				</div>
	// 			</li>
	// 			<li className={styles.sub_item}>
	// 				<div
	// 					role="button"
	// 					tabIndex={0}
	// 					className={styles.sub_item_inner}
	// 					onClick={handleClickColumns}
	// 					style={{
	// 						fontWeight : (isActiveTable && isColActive) ? '550' : '400',
	// 						color      : (isActiveTable && isColActive) ? '#2c3e50' : 'black',
	// 					}}
	// 				>
	// 					<span>
	// 						Columns (
	// 						{table.columns.length}
	// 						)
	// 					</span>
	// 				</div>
	// 			</li>
	// 		</ul>
	// 	) : null}
	// </li>
	);
}

export default SideItem;
