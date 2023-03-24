import { useMemo } from 'react';

const usePreparedData = ({ loading, data, loadingRowsCount = 3 }) => {
	const newData = useMemo(() => {
		if (loading) {
			return new Array(data.length || loadingRowsCount).fill({});
		}
		return data;
	}, [data, loading, loadingRowsCount]);

	return { data: newData };
};

export default usePreparedData;
