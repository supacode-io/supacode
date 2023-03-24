const { sqlJoin } = require('../../../helpers/db-helper');

const queryListProjects = (sql, {
	q, id, code, user_id,
}) => {
	const where = [];
	if (id) where.push(sql`p.id = ${id}`);
	if (code) where.push(sql`p.code = ${code}`);
	if (user_id) where.push(sql`pu.user_id = ${user_id}`);
	if (q) where.push(sql`p.name ilike ${`%${q}%`}`);

	return sql`
        select p.*,
        concat('public__', p.code) as db_schema,
        pu.user_id as user_id, 
        json_build_object (
            'id', user_id,
            'name', u.name,
            'email', u.email
        ) as user
        from ${sql(process.env.DATABASE_CMS_SCHEMA)}.${sql('projects')} p
        left join ${sql(process.env.DATABASE_CMS_SCHEMA)}.${sql('project_users')} pu on p.id = pu.project_id
        left join ${sql(process.env.DATABASE_CMS_SCHEMA)}.${sql('users')} u on pu.user_id = u.id
        ${where.length > 0 ? sql`where ${sqlJoin(where, sql` and `)}` : sql``}
        order by p.created_on desc
    `;
};

module.exports = {
	queryListProjects,
};
