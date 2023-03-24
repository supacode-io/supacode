const { sql } = require('slonik');

const createAuditQuery = (data) => {
	const {
		type,
		description = null,
		object_schema = 'public',
		object_table = null,
		object_id = null,
		object_before = null,
		object_after = null,
		user_id,
	} = data;

	return sql`
        insert into cms_schema.audits
        (
            "type", 
            "description", 
            "object_schema", 
            "object_table", 
            "object_id", 
            "object_before", 
            "object_after",
            "user_id"
        )
        values
        (
            ${type},
            ${description},
            ${object_schema},
            ${object_table},
            ${object_id},
            ${object_after ? sql.jsonb(object_before) : null},
            ${object_after ? sql.jsonb(object_after) : null},
            ${user_id}
        )
        returning id
    `;
};

module.exports = {
	createAuditQuery,
};
