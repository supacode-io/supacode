const { sql } = require('../../../../helpers/db-helper');
const { NotFoundError } = require('../../../../helpers/error-helper');
const { escapeSingleQuote } = require('../../../../helpers/santisation-helper');
const { CMS_TYPE_MAP, cleanUdt } = require('../../../../helpers/type-helper');

const { queryListColumns } = require('./_common');

const updateColumn = async ({ project = {}, params = {}, data = {} }) => {
	const { db_schema:schema_name } = project;
	const { table_name, column_name: old_column_name } = params;
	const { column_name, cms_type, description } = data;

	return sql.begin(async (t) => {
		let [column] = await queryListColumns(t, { schema_name, table_name, column_name: old_column_name });

		if (!column) {
			throw new NotFoundError(`Column '${old_column_name}' not found`);
		}

		const underlying_type = CMS_TYPE_MAP?.[cms_type];
		if (cms_type && underlying_type && column.cms_column.cms_type !== cms_type) {
			await t`--sql
				alter table ${sql(`${schema_name}.${table_name}`)}
				alter column ${sql(old_column_name)} type ${sql.unsafe(underlying_type)} 
				using (trim(${sql(old_column_name)})::${sql.unsafe(cleanUdt(underlying_type))})
			`;

			await t`--sql
				update ${sql('_cms.datastore_columns')} 
				set cms_type=${cms_type} 
				where 
					column_name=${old_column_name}
					and table_name=${table_name}
					and schema_name=${schema_name}
			`;
		}

		if (description && column.description !== description) {
			await t`--sql
				comment on column ${sql(`${schema_name}.${table_name}.${old_column_name}`)} 
				is ${sql.raw(`E'${escapeSingleQuote(description)}'`)}
			`;
		}

		if (column_name && old_column_name !== column_name) {
			await t`--sql
				alter table ${sql(`${schema_name}.${table_name}`)}
				rename column ${sql(old_column_name)} to ${sql(column_name)}
			`;

			await t`--sql
				update ${sql('_cms.datastore_columns')} 
				set column_name=${column_name} 
				where 
					column_name=${old_column_name} 
					and table_name=${table_name} 
					and schema_name=${schema_name}
			`;
		}

		[column] = await queryListColumns(t, { schema_name, table_name, column_name: column_name || old_column_name });

		return { column };
	});
};

const routes = async (fastify) => {
	fastify.patch('/v1/:project_code/datastore/tables/:table_name/columns/:column_name', async (request, reply) => {
		const { params, body, project } = request;
		const result = await updateColumn({ project, params, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, updateColumn };
