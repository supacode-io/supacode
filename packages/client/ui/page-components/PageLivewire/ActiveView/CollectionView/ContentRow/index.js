import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import styles from './styles.module.css';

import Textarea from '@/external-packages/components/Textarea';
import { useCmsRequest } from '@/external-packages/request';

function ContentRow({ collection, content }) {
	const router = useRouter();
	const { projectCode } = router.query;
	const [value, setValue] = useState(content.value);

	const [editing, setEditing] = useState(false);
	const [height, setHeight] = useState(28);

	const divRef = useRef();
	const textareaRef = useRef();

	useEffect(() => {
		if (divRef?.current?.offsetHeight) {
			setHeight(divRef.current.offsetHeight);
		}
	}, []);

	const [{ loading }, trigger] = useCmsRequest({
		method : 'POST',
		url    : `/v1/${projectCode}/livewire/contents/${collection.code}/${content.key}`,
	}, { manual: true });

	const handleBlur = async (e) => {
		const res = await trigger({ data: { value: e.target.value } });
		setValue(res.data.content.value);
		setEditing(false);
	};

	return (
		<div className={styles.container}>
			<div className={styles.key_container}>
				<span>
					{content.key}
				</span>
			</div>
			<div className={styles.value_container}>
				{!editing
					? (
						<div
							ref={divRef}
							className={styles.value_text_read}
							tabIndex={0}
							role="button"
							onClick={() => setEditing(true)}
						>
							{loading ? 'Loading...' : null}
							<span>
								{value}
							</span>
						</div>

					)
					: (
						<Textarea
							ref={textareaRef}
							style={{ height }}
							defaultValue={value}
							onBlur={handleBlur}
							autoFocus
						/>
					)}
			</div>
		</div>
	);
}

export default ContentRow;
