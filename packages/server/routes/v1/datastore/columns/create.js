/* eslint-disable max-len */

const { sql } = require('../../../../helpers/db-helper');
const { DuplicateError } = require('../../../../helpers/error-helper');
const { escapeSingleQuotes } = require('../../../../helpers/santisation-helper');
const { CMS_TYPE_MAP, cleanUdt } = require('../../../../helpers/type-helper');

const { queryListColumns } = require('./_common');

const createColumn = async ({ project = {}, params = {}, data = {} }) => {
	const { id: project_id, db_schema: schema_name } = project;
	const { table_name } = params;
	const {
		column_name,
		cms_type,
		required = false,
		default_value = null,
		unique = false,
		description = null,
		possible_values = [],
		value_if_true = null,
		value_if_false = null,
		reference_schema = null,
		reference_table = null,
		reference_column = null,
		validation_min_char = null,
		validation_max_char = null,
		validation_pattern = null,
		validation_min = null,
		validation_max = null,
	} = data;
	const underlyingType = CMS_TYPE_MAP[cms_type];

	return sql.begin(async (t) => {
		let [column] = await queryListColumns(t, { schema_name, table_name, column_name });

		if (column) {
			throw new DuplicateError(`Column '${column_name}' already exists`);
		}

		await t`--sql
		    alter table ${sql(`${schema_name}.${table_name}`)}
		    add column ${sql(column_name)} ${sql.unsafe(underlyingType)}
		    ${required ? sql`not null` : sql``}
		    ${default_value ? sql`default ${default_value}::${cleanUdt(underlyingType)}` : sql``}
		`;

		if (reference_table && reference_column) {
			const constraintName = `foreign_${table_name}__${column_name}`;
			await t`--sql
	            alter table ${sql(`${schema_name}.${table_name}`)}
	            add constraint ${sql(constraintName)}
	            foreign key (${sql(column_name)})
	            references ${sql(`${reference_schema || schema_name}.${reference_table}`)}(${sql(reference_column)})
	        `;
		}

		if (unique) {
			const constraintName = `unique_${table_name}__${column_name}`;
			await t`--sql
	            alter table ${sql(`${schema_name}.${table_name}`)}
	            add constraint ${sql(constraintName)} unique(${sql(column_name)})
	        `;
		}

		if (description) {
			await t`--sql
	            comment on column ${sql(`${schema_name}.${table_name}.${column_name}`)}
				is ${sql.unsafe(`E'${escapeSingleQuotes(description)}'`)}
	        `;
		}

		const [{ next_ordinal_position: ordinalPosition }] = await t`--sql
	        select (coalesce(max(ordinal_position), 0) + 1) as next_ordinal_position
	        from ${sql('_cms.datastore_columns')} c
	        where
	            c.schema_name = ${schema_name} and
	            c.table_name = ${table_name}
	    `;

		await t`--sql
	        insert into ${sql('_cms.datastore_columns')} (
				project_id,
	            schema_name,
	            table_name,
	            column_name,
	            ordinal_position,
	            cms_type,
	            possible_values,
	            value_if_true,
	            value_if_false,
	            validation_min_char,
	            validation_max_char,
	            validation_pattern,
	            validation_min,
	            validation_max
	        ) values (
	            ${project_id},
				${schema_name},
	            ${table_name},
	            ${column_name},
	            ${ordinalPosition},
	            ${cms_type},
	            ${possible_values},
	            ${value_if_true},
	            ${value_if_false},
	            ${validation_min_char},
	            ${validation_max_char},
	            ${validation_pattern},
	            ${validation_min},
	            ${validation_max}
	        )
	        returning *
	    `;

		[column] = await queryListColumns(t, { schema_name, table_name, column_name });

		return { column };
	});
};

const routes = async (fastify) => {
	fastify.post('/v1/:project_code/datastore/tables/:table_name/columns', async (request, reply) => {
		const { project, params, body } = request;
		const result = await createColumn({ project, params, data: body });
		return reply.status(200).send(result);
	});
};

module.exports = { default: routes, createColumn };
