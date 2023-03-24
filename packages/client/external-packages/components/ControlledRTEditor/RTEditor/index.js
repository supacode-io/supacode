import React, { useEffect, useRef, useState } from 'react';

import 'react-quill/dist/quill.snow.css';
import styles from './styles.module.css';

function RTEditor({ value, onChange }) {
	const rQuillRef = useRef();
	const quillRef = useRef();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			if (typeof window !== 'undefined') {
				const module = await import('react-quill');
				rQuillRef.current = module.default;
				quillRef.current = rQuillRef.current.Quill;

				// const BlotFormatter = await import('quill-blot-formatter');
				const ImageResize = await import('quill-image-resize-module-react');

				// eslint-disable-next-line prefer-destructuring
				// console.log({ BlotFormatter, ImageResize });
				quillRef.current.register('modules/imageResize', ImageResize.default);
				// quillRef.current.register('modules/blotFormatter', BlotFormatter.default);
				setLoaded(true);
			}
		})();
	}, []);

	const ReactQuill = rQuillRef.current;
	const Quill = quillRef.current;

	if (!loaded) {
		return null;
	}

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image'],
			['clean'],
		],
		imageResize: {
			parchment : Quill.import('parchment'),
			modules   : ['Resize', 'DisplaySize'],
		},
	};

	const formats = [
		'header',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image',
	];

	return (
		<ReactQuill
			className={styles.container}
			modules={modules}
			formats={formats}
			theme="snow"
			value={value}
			onChange={onChange}
		/>
	);
}

export default RTEditor;
