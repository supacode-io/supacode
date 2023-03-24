const {
	S3Client,
	PutObjectCommand,
	HeadObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	CopyObjectCommand,
	ListObjectsV2Command,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const region = 'ap-south-1';

const s3Client = new S3Client({
	region,
	accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
});

const bucket = process.env.AWS_CDN_BUCKET;
const domain = process.env.AWS_CDN_DOMAIN;

async function getUrlPair(key, { metadata, mimeType }) {
	const command = new PutObjectCommand({
		Bucket      : bucket,
		Key         : key,
		Metadata    : metadata,
		ContentType : mimeType,
		ACL         : 'public-read',
	});

	const writeUrl = await getSignedUrl(s3Client, command, {
		expiresIn: 3600,
	});

	let readUrl = `https://s3.${region}.amazonaws.com/${bucket}/${key}`;
	if (domain) {
		readUrl = `https://${domain}/${key}`;
	}
	return { writeUrl, readUrl };
}

async function getObjectHead(key) {
	const params = {
		Bucket : bucket,
		Key    : key,
	};
	const command = new HeadObjectCommand(params);
	return s3Client.send(command);
}

async function getObject(key) {
	const params = {
		Bucket : bucket,
		Key    : key,
	};
	const command = new GetObjectCommand(params);
	return s3Client.send(command);
}

async function listObjects(prefix) {
	const params = {
		Bucket : bucket,
		Prefix : prefix,
	};
	const command = new ListObjectsV2Command(params);
	return s3Client.send(command);
}

async function copyObject(oldKey, newKey) {
	const params = {
		ACL        : 'public-read',
		Bucket     : bucket,
		CopySource : `/${bucket}/${oldKey}`,
		Key        : newKey,
	};
	const command = new CopyObjectCommand(params);
	return s3Client.send(command);
}

async function deleteObject(key) {
	const params = {
		Bucket : bucket,
		Key    : key,
	};
	const command = new DeleteObjectCommand(params);
	return s3Client.send(command);
}

module.exports = {
	getUrlPair,
	getObjectHead,
	getObject,
	copyObject,
	deleteObject,
	listObjects,
};
