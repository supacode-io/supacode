import React from 'react';

import styles from './styles.module.css';

console.log({ styles });

function CardPreview({ file }) {
	const type = file.mime_type.split('/')[0];

	switch (type) {
		case 'image':
			return (
				<img
					className={styles.image_preview}
					src={file.url}
					alt={file.name}
				/>
			);
		default:
			return <span>No Preview Available</span>;
	}
}

export default CardPreview;
