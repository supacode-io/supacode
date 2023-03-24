import { Button } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useCmsRequest } from '../../../external-packages/request';
import Actionbar from '../../components/Actionbar';

import AddFileModal from './AddFileModal';
import EditFileModal from './EditFileModal';
import FileCard from './FileCard';
import PreviewDialog from './FileCard/PreviewDialog';
import styles from './styles.module.css';

import { Pagination } from '@/ui/components/Pagination';

function PageVault() {
	const router = useRouter();
	const { projectCode } = router.query;
	const [search, setSearch] = useState('');
	const [show, setShow] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editFile, setEditFile] = useState(null);
	const limit = 20;
	const [page, setPage] = useState(1);
	const [previewFile, setPreviewFile] = useState(null);
	const params = { limit, offset: (page - 1) * limit };
	if (search) {
		params.q = search;
	}

	useEffect(() => {
		setPage(1);
	}, [search]);

	const [{ data }, triggerList] = useCmsRequest({
		method : 'get',
		url    : `/v1/${projectCode}/vault/files`,
		params,
	});
	const [, triggerDelete] = useCmsRequest({ method: 'delete' }, { manual: true });

	const handleDelete = async (file) => {
		const res = window.confirm('Are you sure you want to delete?');
		if (res) {
			await triggerDelete({ url: `/v1/${projectCode}/vault/files/${file.id}` });
			await triggerList();
		}
	};

	const handleEdit = (file) => {
		setShowEditModal(true);
		setEditFile(file);
	};

	return (
		<div className={styles.container}>
			<Actionbar
				buttons={(
					<Button
						intent="primary"
						onClick={() => {
							setShow(true);
							setEditFile(null);
						}}
						icon="add"
					>
						Upload New
					</Button>
				)}
				showSearch
				searchProps={{
					placeholder : 'Search "Files" in Vault',
					onChange    : (s) => setSearch(s),
					value       : search,
				}}
				extras={(
					<Pagination
						currentPage={page}
						totalItems={data?.total || 0}
						pageSize={limit}
						onPageChange={(p) => setPage(p)}
					/>
				)}
			/>
			<div className={styles.content_container}>
				<div className={styles.view_container}>
					{data?.files.map((file) => (
						<FileCard
							key={file.id}
							file={file}
							onEdit={() => handleEdit(file)}
							onDelete={() => handleDelete(file)}
							onClick={() => setPreviewFile(file)}
						/>
					))}
				</div>

			</div>
			<PreviewDialog
				previewFile={previewFile}
				onClose={() => setPreviewFile(null)}
			/>
			<AddFileModal
				show={show}
				onClose={() => setShow(false)}
				onComplete={() => triggerList()}
			/>
			<EditFileModal
				show={showEditModal}
				editFile={editFile}
				onClose={() => setShowEditModal(false)}
				onComplete={() => triggerList()}
			/>
		</div>
	);
}

export default PageVault;
