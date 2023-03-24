import { Dialog } from '@blueprintjs/core';
import React from 'react';

import CardPreview from '../CardPreview';

function PreviewDialog({ previewFile, onClose }) {
	const show = !!previewFile;

	return (
		<Dialog isOpen={show} onClose={onClose}>
			<CardPreview file={previewFile} />
		</Dialog>
	);
}

export default PreviewDialog;
