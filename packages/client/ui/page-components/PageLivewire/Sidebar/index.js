import { Button, InputGroup } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import AddCollectionModal from './AddCollectionModal';
import SideItem from './SideItem';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import RequestView from '@/ui/components/RequestView';

function TableListSidebar() {
	const router = useRouter();
	const [showAdd, setShowAdd] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const { projectCode } = router.query;
	const [{ data, loading, error }, triggerList] = useCmsRequest(`/v1/${projectCode}/livewire/collections`);
	const { activeTabId } = useSelector((state) => state.livewire.tabview);

	const collections = useMemo(() => {
		if (searchValue) {
			return data?.collections?.filter((t) => t.name.toLowerCase().includes(searchValue.toLowerCase()));
		}
		return data?.collections || [];
	}, [data?.collections, searchValue]);

	return (
		<div>
			<RequestView loading={loading} error={error}>
				<div className={styles.search_container}>
					<InputGroup
						type="text"
						placeholder="Search collections"
						value={searchValue}
						onChange={(v) => setSearchValue(v)}
					/>
					<Button icon="add" onClick={() => setShowAdd((prev) => !prev)} />
				</div>
				<ul className={styles.list_container}>
					{collections?.map((collection) => (
						<SideItem
							key={collection.id}
							collection={collection}
							triggerList={triggerList}
							isActive={activeTabId === `collection-${collection.name}`}
						/>
					))}
				</ul>
			</RequestView>
			<AddCollectionModal
				show={showAdd}
				onClose={() => setShowAdd(false)}
				triggerList={triggerList}
			/>
		</div>
	);
}

export default TableListSidebar;
