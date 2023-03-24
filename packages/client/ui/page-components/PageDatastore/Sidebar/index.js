import { Button, InputGroup, Menu } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

// import { useSelector } from 'react-redux';
import AddTableModal from '../ActiveView/AddTableModal';

import SideItem from './SideItem';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import RequestView from '@/ui/components/RequestView';

function TableListSidebar() {
	const router = useRouter();
	const { projectCode } = router.query;
	// const { activeTabId } = useSelector((state) => state.datastore.tabview);
	// const [expanded, setExpanded] = useState([]);
	const [showAdd, setShowAdd] = useState(false);
	// const [isTableCreated, setIsTableCreated] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const [{ data, loading, error }, triggerList] = useCmsRequest(`/v1/${projectCode}/datastore/tables`);

	// useEffect(() => {
	// 	if (isTableCreated) { triggerList(); }
	// }, [isTableCreated, triggerList]);

	const tables = useMemo(() => {
		if (searchValue) {
			return data?.tables?.filter((t) => t.table_name.toLowerCase().includes(searchValue.toLowerCase()));
		}
		return data?.tables || [];
	}, [data?.tables, searchValue]);

	return (
		<div className={styles.container}>
			<RequestView loading={loading} error={error}>
				<div className={styles.top_container}>
					<InputGroup
						className={styles.search_input}
						type="text"
						placeholder="Search Tables"
						onChange={(e) => { setSearchValue(e.target.value); }}
						leftIcon="search"
					/>
				</div>
				<div
					style={{ marginLeft: 8, marginRight: 8, marginBottom: 4 }}
				>
					<Button
						icon="add"
						onClick={() => setShowAdd((prev) => !prev)}
						text="Create New Table"
						fill
					/>
				</div>
				<Menu>
					{tables?.map((table) => (
						<SideItem
							key={table.table_name}
							// expanded={expanded}
							triggerList={triggerList}
							// setExpanded={setExpanded}
							table={table}
						/>
					))}

				</Menu>
			</RequestView>

			<AddTableModal
				tableName="CustomTable"
				// setIsTableCreated={setIsTableCreated}
				show={showAdd}
				onClose={() => setShowAdd(false)}
			/>
		</div>
	);
}

export default TableListSidebar;
