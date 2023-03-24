import { Button } from '@blueprintjs/core';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import Actionbar from '../../../../components/Actionbar';

import AddContentModal from './AddContentModal';
import AddLocaleModal from './AddLocaleModal';
import ContentRow from './ContentRow';
import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import Select from '@/ui/components/Select';

function CollectionView({ collection }) {
	const router = useRouter();
	const { projectCode } = router.query;

	const [search, setSearch] = useState('');
	const [show, setShow] = useState('');
	const [showLocaleModal, setShowLocaleModal] = useState(false);
	const [selectedLocale, setSelectedLocale] = useState(null);

	const [{ data: localeData }, triggerLocale] = useCmsRequest({
		url: `/v1/${projectCode}/livewire/locales`,
	}, { manual: true });

	const [{ data: contentData }, triggerContent] = useCmsRequest({
		url    : `/v1/${projectCode}/livewire/contents/${collection.code}`,
		params : { limit: 100 },
	}, { manual: true });

	useEffect(() => {
		(async () => {
			const localeRes = await triggerLocale();
			const defaultLocale = localeRes.data.locales.find((l) => l.is_default);
			setSelectedLocale(defaultLocale.code);
			await triggerContent({ params: { locale_code: defaultLocale.code } });
		})();
	}, [triggerContent, triggerLocale]);

	const { contents = [] } = contentData || {};
	const filteredContents = useMemo(() => {
		if (search) {
			return contents.filter((c) => c.key.toLowerCase().includes(search.toLowerCase()));
		}
		return contents;
	}, [contents, search]);

	const handleLocaleChange = async (localeCode) => {
		setSelectedLocale(localeCode);
		await triggerContent({ params: { locale_code: localeCode } });
	};

	return (
		<div className={styles.container}>
			<Actionbar
				showSearch
				searchProps={{
					placeholder : 'Search via key',
					onChange    : (v) => setSearch(v),
					value       : search,
				}}
				buttons={(
					<Button onClick={() => setShow(true)}>+ Add New</Button>
				)}
				extras={(
					<div className={styles.extras_container}>
						<Button size="sm" onClick={() => setShowLocaleModal(true)}>Add Locale +</Button>
						<Select
							labelKey="code"
							valueKey="code"
							onChange={handleLocaleChange}
							items={localeData?.locales}
							value={selectedLocale}
						/>
					</div>
				)}
			/>
			<div className={styles.view_container}>
				{filteredContents.map((content) => (
					<ContentRow key={content.id} collection={collection} content={content} />
				))}
			</div>
			<AddContentModal
				show={show}
				triggerContent={triggerContent}
				selectedLocale={selectedLocale}
				collection={collection}
				onClose={() => setShow(false)}
			/>
			<AddLocaleModal
				show={showLocaleModal}
				triggerLocale={triggerLocale}
				onClose={() => setShowLocaleModal(false)}
			/>
		</div>
	);
}

export default CollectionView;
