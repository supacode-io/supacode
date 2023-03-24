import {
	Button, Card, Classes, Divider, H5, Menu, MenuDivider, Text,
} from '@blueprintjs/core';
import { MenuItem2, Popover2 } from '@blueprintjs/popover2';
import copy from 'copy-to-clipboard';
import React, { useState } from 'react';

import CardPreview from './CardPreview';
import styles from './styles.module.css';

import { Toast } from '@/ui/components/Toaster';
import cl from '@/ui/helpers/classnames';

function FileCard({ file, onClick = () => {}, onEdit = () => {}, onDelete = () => {} }) {
	const [showMore, setShowMore] = useState(false);

	const onCopy = (e) => {
		e.stopPropagation();
		copy(file.url);
		Toast.show({ message: 'Copied URL', intent: 'success' });
	};

	return (
		<Card
			className={styles.container}
			interactive
			onClick={onClick}
		>
			<div title={file.name} className={styles.preview_container}>
				<CardPreview file={file} />
			</div>
			<Divider style={{ marginBottom: 16 }} vertical />
			<div style={{ marginBottom: 16 }} className={styles.details_container}>
				<H5 title={file.name} className={cl`${Classes.TEXT_OVERFLOW_ELLIPSIS}`}>{file.name}</H5>
				<Text className={cl`${Classes.TEXT_SMALL} ${Classes.TEXT_MUTED} ${Classes.TEXT_OVERFLOW_ELLIPSIS}`}>
					{file.description}
				</Text>
			</div>
			<div className={styles.action_container}>
				<Button icon="link" onClick={onCopy} outlined>Copy URL</Button>
				<Popover2
					isOpen={showMore}
					onInteraction={(v, e) => {
						if (e) {
							e.stopPropagation();
						}
						setShowMore(v);
					}}
					placement="bottom-start"
					content={(
						<Menu>
							<MenuItem2 icon="edit" text="Rename" onClick={onEdit} />
							<MenuDivider />
							<MenuItem2 intent="danger" icon="trash" text="Delete" onClick={onDelete} />
						</Menu>
					)}
				>
					<Button icon="more" outlined />
				</Popover2>
			</div>
		</Card>
	);
}

export default FileCard;
