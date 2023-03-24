const mime = require('mime');

mime.define({
	'video/quicktime' : ['mov'],
	'audio/mpeg'      : ['mp3'],
}, true);

const { getExtension } = mime;
const { getType } = mime;

module.exports = { getExtension, getType };
