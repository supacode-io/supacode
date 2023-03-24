const queryListContent = (sql, { collection_id, locale_id, key }) => sql`
        select lc.*, row_to_json(ll.*) as locale, row_to_json(ls.*) as collection 
        from _cms.livewire_contents lc
        left join _cms.livewire_locales ll on lc.locale_id=ll.id
        left join _cms.livewire_collections ls on lc.collection_id=ls.id
        where 
            lc.collection_id=${collection_id}
            and lc.locale_id=${locale_id}
            ${key ? sql`and lc.key=${key}` : sql``}
    `;

module.exports = { queryListContent };
