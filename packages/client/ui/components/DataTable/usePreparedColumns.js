import React, { useMemo } from 'react';

function Loader() {
	return (
		<span>...</span>
	);
}

const usePreparedColumns = ({ columns, loading }) => {
	const newColums = useMemo(() => {
		if (loading) {
			return columns.map((col) => ({
				...col,
				accessor: (row, index) => (
					<div style={{ width: '100' }}>
						{index > 2 ? null : <Loader />}
					</div>
				),
			}));
		}
		return columns;
	}, [loading, columns]);

	return { columns: newColums };
};

export default usePreparedColumns;
