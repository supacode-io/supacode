import { Button } from '@blueprintjs/core';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import Addusers from '../Addusers';
import Editusers from '../Editusers';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

function Details() {
	const [edit, setedit] = useState(false);
	const [add, setadd] = useState(false);

	const [{ data: users }, triggerlist] = useCmsRequest({
		method : 'GET',
		url    : '/v1/users',
	}, { manual: true });

	const [{ data:singleuserdata }, triggerget] = useCmsRequest({
		method: 'GET',
	}, { manual: true });

	const [, triggerdelete] = useCmsRequest({
		method: 'DELETE',
	}, { manual: true });

	const handleClickOnDelete = async (user_id) => {
		const res = window.confirm('Are you sure you want to delete?');
		if (res) {
			await triggerdelete({ url: `/v1/users/${user_id}` });
			triggerlist();
		}
	};
	const handleClickOnAdd = () => {
		setadd(true);
	};
	const handleClickOnEdit = async (singleuser_id) => {
		await triggerget({ url: `/v1/users/${singleuser_id}` });
		setedit(true);
	};
	useEffect(() => {
		triggerlist();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onEditClose = () => {
		setedit(false);
	};
	const onAddClose = () => {
		setadd(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.heading}>

				<div className={styles.userhead}>
					Users Details
				</div>
				<div className={styles.addbutton}>
					<Button onClick={() => { handleClickOnAdd(); }}>Add User</Button>
				</div>
			</div>

			<div className={styles.usertable}>
				<table className={styles.table}>

					<thead className={styles.tableheading}>
						<th className={styles.tablehead}>Name</th>
						<th className={styles.tablehead}>Email</th>
						<th className={styles.tablehead}>Created On</th>
						<th className={styles.tablehead}>Updated On</th>
						<th className={styles.tablehead}>Actions</th>

					</thead>
					<tbody>
						{users?.map((rows) => (
							<tr>
								<td className={styles.tabledata}>{rows.name}</td>
								<td className={styles.tabledata}>
									{rows.email}
								</td>
								<td className={styles.tabledata}>
									{format(rows.created_on, 'dd-MM-YYYY hh:mm aa')}
								</td>
								<td className={styles.tabledata}>
									{format(rows.updated_on, 'dd-MM-YYYY hh:mm aa')}
								</td>
								<td className={styles.actions}>

									<Button
										icon="edit"
										className={styles.action_button}
										onClick={() => { handleClickOnEdit(rows.id); }}
									/>
									<Button
										icon="trash"
										className={styles.action_button}
										onClick={() => { handleClickOnDelete(rows.id); }}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>

			</div>
			{add
            && <Addusers triggerlist={triggerlist} show={add} onClose={onAddClose} />}

			{edit
            && <Editusers triggerlist={triggerlist} userdata={singleuserdata} show={edit} onClose={onEditClose} />}
		</div>
	);
}

export default Details;
