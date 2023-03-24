/* eslint-disable max-len */

const { sql } = require('../../../../helpers/db-helper');
const { escapeSingleQuotes } = require('../../../../helpers/santisation-helper');
const { CMS_TYPE_MAP } = require('../../../../helpers/type-helper');

const { queryListTables } = require('./_common');

const createTable = ({ project = {}, data = {} }) => {
	const { id: project_id, db_schema: schema_name } = project;
	const { table_name, description } = data;
	return sql.begin(async (t) => {
		const constraintName = `primary_${table_name}__id`;
		await t`--sql
			create table ${sql(`${schema_name}.${table_name}`)} (
				_id ${sql.unsafe(CMS_TYPE_MAP.id)} default gen_random_uuid() constraint ${sql(constraintName)} primary key,
				_created_on ${sql.unsafe(CMS_TYPE_MAP.timestamp)} not null default now(),
				_updated_on ${sql.unsafe(CMS_TYPE_MAP.timestamp)} not null default now(),
				_published_on ${sql.unsafe(CMS_TYPE_MAP.timestamp)}
			)
		`;

		await t`--sql
			insert into ${sql('_cms.datastore_columns')} 
				(project_id, schema_name, table_name, column_name, ordinal_position, cms_type) 
			values 
				(${project_id}, ${schema_name}, ${table_name}, '_id', 1, 'id'),
				(${project_id}, ${schema_name}, ${table_name}, '_created_on', 2, 'timestamp'),
				(${project_id}, ${schema_name}, ${table_name}, '_updated_on', 3, 'timestamp'),
				(${project_id}, ${schema_name}, ${table_name}, '_published_on', 4, 'timestamp')
		`;

		if (description) {
			await t`--sql
				comment on table ${sql(`${schema_name}.${table_name}`)} 
				is ${sql.unsafe(`E'${escapeSingleQuotes(description)}'`)}
			`;
		}

		const [table] = await queryListTables(t, { schema_name, table_name });

		return { table };
	});
};

const routes = async (fastify) => {
	fastify.post('/v1/:project_code/datastore/tables', async (request, reply) => {
		const { body, project } = request;
		const result = await createTable({ project, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createTable };
