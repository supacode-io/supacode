const queryListTables = (sql, { schema_name, table_name } = {}) => sql`--sql
    select 
        t.table_schema as schema_name,
        t.table_name as table_name,
        obj_description(
            concat(quote_ident(t.table_schema), '.' , quote_ident(t.table_name))::regclass, 'pg_class'
        ) as description,
        array_agg(
            json_build_object('name', c.column_name::text, 'underlying_type', c.udt_name::text)
            order by c.ordinal_position asc
        ) as columns
    from information_schema.tables t
    inner join information_schema.columns c on t.table_name = c.table_name
    where
        t.table_schema = ${schema_name}
        and t.table_type = 'BASE TABLE'
        and c.table_schema = ${schema_name}
        ${table_name ? sql`and t.table_name = ${table_name}` : sql``}
    group by t.table_schema, t.table_name
`;

module.exports = { queryListTables };
