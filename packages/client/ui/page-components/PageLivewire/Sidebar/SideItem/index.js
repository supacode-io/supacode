import { Icon } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import cl from '@/ui/helpers/classnames';
import { addLivewireActiveTab, removeLivewireTab } from '@/ui/store/livewire/tabview-slice';

function SideItem({ isActive, collection, triggerList }) {
	const dispatch = useDispatch();
	const router = useRouter();
	const { projectCode } = router.query;

	const handleClick = (newCollection) => {
		dispatch(addLivewireActiveTab({
			id        : `collection-${newCollection.name}`,
			name      : `Collection: ${newCollection.name}`,
			component : 'CollectionView',
			props     : { collection: newCollection },
		}));
	};

	const [, triggerDelete] = useCmsRequest({
		method : 'delete',
		url    : `/v1/${projectCode}/livewire/collections/${collection.id}`,
	}, { manual: true });

	const handleDelete = async (e) => {
		e.stopPropagation();
		const res = window.confirm('Are you sure you want to delete the table?');
		if (res) {
			await triggerDelete();
			await triggerList();
			dispatch(removeLivewireTab(`collection-${collection.name}`));
		}
	};

	return (
		<li
			className={cl`
                ${styles.list_item}
            `}
			style={{
				fontWeight: isActive ? '600' : '400',
			}}
		>
			<div
				className={styles.list_item_inner}
				role="button"
				tabIndex={0}
				onClick={() => handleClick(collection)}
			>
				{/* <IcMListView /> */}
				<span>{collection.name}</span>
				<div role="presentation" onClick={(e) => handleDelete(e)}>
					<Icon icon="trash" />
				</div>
			</div>
		</li>
	);
}

export default SideItem;
