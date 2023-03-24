/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');

const axios = require('axios');
const uniqBy = require('lodash/uniqBy');

const pathToDir = process.argv[2];
console.log({ pathToDir });
let data = [];

async function init() {
	const dir = path.resolve(__dirname, '../', pathToDir);
	const files = await fs.readdir(dir);
	console.log({ files });
	const promises_en = files.map(async (file) => {
		const data_en = await fs.readFile(path.resolve(dir, file, 'en-IN.json'), 'utf8');

		const item = {
			collection_name : file.replace('.json', ''),
			file_name       : file,
			locale          : 'en-IN',
			content         : JSON.parse(data_en),
		};

		return item;
	}, []);

	const promises_vi = files.map(async (file) => {
		const data_en = await fs.readFile(path.resolve(dir, file, 'vi-VN.json'), 'utf8');

		const item = {
			collection_name : file.replace('.json', ''),
			file_name       : file,
			locale          : 'vi-VN',
			content         : JSON.parse(data_en),
		};

		return item;
	}, []);

	const promises = [...promises_en, ...promises_vi];
	const additionalContent = await Promise.all(promises);
	data = data.concat(additionalContent);
}

const options = {
	headers: {
		Authorization: `Bearer ${process.env.CMS_TOKEN}`,
	},
};

async function checkOrCreateCollections() {
	const uniqueCollections = uniqBy(data, (item) => item.collection_name);

	const promises = uniqueCollections.map(async (c) => {
		let shouldCreate = false;

		try {
			const res = await axios.get(`${process.env.CMS_SERVER_URL}/v1/cogo_public/livewire/contents/${c.collection_name}`, options);
			if (!res.data?.contents) {
				shouldCreate = true;
			}
		} catch (err) {
			if (err.response.status === 404) {
				console.log('404');
				shouldCreate = true;
			}
		}

		if (shouldCreate) {
			await axios.post(
				`${process.env.CMS_SERVER_URL}/v1/cogo_public/livewire/collections`,
				{
					name : c.collection_name,
					code : c.collection_name,
				},
				options,
			);
			console.log('--CREATE--', c.collection_name);
		}

		return `OK - ${c.collection_name}`;
	});

	const status = await Promise.all(promises);

	console.log(status);
}

async function pushToCMS() {
	const promises2 = data.map(async (item, i) => {
		const contents = [];

		Object.keys(item.content).forEach(async (key) => {
			contents.push({ key, value: item.content[key] });
		});

		try {
			await axios.post(
				`${process.env.CMS_SERVER_URL}/v1/cogo_public/livewire/contents/bulk/${item.collection_name}`,
				{
					locale_code: item.locale,
					contents,
				},
				options,
			);
			console.log('--POST--', item.collection_name, item.locale);
		} catch (err) {
			console.log(err?.response?.data || err.toString());
		}

		return `PUSHED - ${item.collection_name}`;
	});
	const result = await Promise.all(promises2);
	console.log(result);
}

async function main() {
	await init();
	await checkOrCreateCollections();
	await pushToCMS();
}

main();
