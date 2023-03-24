import { Button, Card, Classes, H3 } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import AddProjectModal from './AddProjectModal';
import EditProjectModal from './EditProjectModal';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import Actionbar from '@/ui/components/Actionbar';
import cl from '@/ui/helpers/classnames';

export default function Home() {
	const router = useRouter();
	const auth = useSelector((s) => s.auth?.session?.user?.email);
	const [show, setShow] = useState(false);
	const [projectData, setProjectData] = useState();
	const [showEdit, setShowEdit] = useState(false);
	const [added, setAdded] = useState(false);
	const [search, setSearch] = useState('');
	const [edited, setEdited] = useState(false);
	const limit = 10;
	const params = { limit };
	// if (search) {
	// 	params.q = search;
	// }

	const [{ data, loading }, triggerList] = useCmsRequest({
		method : 'get',
		url    : '/v1/projects',
		params,
	});

	const projects = useMemo(() => {
		if (search) {
			return data?.projects?.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
		}
		return data?.projects || [];
	}, [data?.projects, search]);

	useEffect(() => {
		if (edited || added) { triggerList(); }
	}, [edited, triggerList, added]);
	// useEffect(() => {
	// 	async function refetch() {
	// 		await triggerget();
	// 	}
	// 	refetch();
	// }, [show]);

	const handleEdit = (e, project) => {
		e.stopPropagation();
		setProjectData(project);
		setShowEdit(true);
	};

	const handleClickOnCard = (e, project) => {
		e.stopPropagation();
		router.push(`/app/${project.code}`);
	};

	return (
		<div className={styles.container}>
			<Actionbar
				buttons={(
					<Button icon="add" onClick={() => setShow(true)}>
						Create Project
					</Button>
				)}
				showSearch
				searchProps={{
					leftIcon    : 'search',
					placeholder : 'Search Projects',
					onChange    : (s) => setSearch(s),
					value       : search,
				}}

			/>
			<div className={styles.content_container}>
				<div className={styles.inner_container}>
					{loading && <p>Loading...</p>}
					{!loading && projects?.map((project) => (
						<Card
							key={project.id}
							className={styles.card_container}
							interactive
							onClick={(e) => handleClickOnCard(e, project)}
						>
							<H3>{project.name}</H3>
							<p className={cl`${Classes.TEXT_MUTED}`}>{project.code}</p>
							<div className={styles.card_action_container}>
								<Button
									small
									icon="edit"
									text="Edit"
									outlined
									onClick={(e) => handleEdit(e, project)}
								/>
							</div>
						</Card>
					))}

				</div>

				<AddProjectModal
					show={show}
					setAdded={setAdded}
					onClose={() => setShow(false)}
				/>
				<EditProjectModal
					projectData={projectData}
					show={showEdit}
					setEdited={setEdited}
					onClose={() => setShowEdit(false)}
				/>
			</div>
		</div>
	);
}
