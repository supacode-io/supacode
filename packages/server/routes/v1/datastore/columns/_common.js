const { NotFoundError } = require('../../../../helpers/error-helper');

const queryListColumns = async (sql, { schema_name, table_name, column_name = null }) => {
	const [table] = await sql`
        select id from _cms.datastore_columns
        where schema_name=${schema_name} and table_name=${table_name}
        limit 1
    `;

	if (!table) {
		throw new NotFoundError(`Table '${table_name}' not found`);
	}

	const columns = await sql`
        select
            c.table_schema as schema_name,
            c.table_name as table_name,
            c.column_name as column_name,
            c.udt_name as underlying_type,
            (
                SELECT
                    pg_catalog.col_description(cd.oid, c.ordinal_position::int)
                FROM pg_catalog.pg_class cd
                WHERE
                    cd.oid     = (
                        SELECT concat(quote_ident(c.table_schema), '.', quote_ident(c.table_name))::regclass::oid
                    ) AND
                    cd.relname = c.table_name
            ) as description,

            case 
                when c.is_nullable = 'YES' then false 
                when c.is_nullable = 'NO' then true 
            end as is_required,
            c.column_default as default_vaule,
            case
                when tc.constraint_type = 'UNIQUE' then true
                else false
            end as is_unique,
            case
                when tc.constraint_type = 'PRIMARY KEY' then true
                else false
            end as is_primary,
            case
                when tc.constraint_type = 'FOREIGN KEY' then true
                else false
            end as is_reference,
            case
                when tc.constraint_type = 'FOREIGN KEY' then ccu.table_schema
                else null
            end as reference_schema,
            case
                when tc.constraint_type = 'FOREIGN KEY' then ccu.table_name
                else null
            end as reference_table,
            case
                when tc.constraint_type = 'FOREIGN KEY' then ccu.column_name
                else null
            end as reference_column,
            row_to_json(cc.*) as cms_column
        from
            information_schema.columns c
        left join information_schema.key_column_usage kcu
            on c.table_schema = kcu.constraint_schema
            and c.table_name = kcu.table_name
            and c.column_name = kcu.column_name
        left join information_schema.table_constraints tc
            on c.table_schema = tc.constraint_schema
            and kcu.constraint_name = tc.constraint_name
        left join information_schema.constraint_column_usage ccu
            on c.table_schema = ccu.table_schema
            and kcu.constraint_name = ccu.constraint_name
        left join ${sql('_cms.datastore_columns')} cc 
            on c.table_schema = cc.schema_name
            and c.table_name = cc.table_name
            and c.column_name = cc.column_name 
        where
            c.table_schema = ${schema_name}
            and c.table_name = ${table_name}
            ${column_name ? sql`and c.column_name = ${column_name}` : sql``}
    `;

	return columns;
};

module.exports = { queryListColumns };
