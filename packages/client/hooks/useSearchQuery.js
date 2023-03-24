import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

const useSearchQuery = () => {
	const [query, setQuery] = useState();

	const request = debounce((value) => {
		setQuery(value);
	}, 600);

	const debounceQuery = useCallback((value) => request(value), [request]);

	return { debounceQuery, query };
};

export default useSearchQuery;
