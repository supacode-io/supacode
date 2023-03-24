import React from 'react';

import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';

function ClearButton({ children, className, ...rest }) {
	return (
		<button
			type="button"
			className={cl`
                ${styles.container}
                ${className}
            `}
			{...rest}
		>
			{children}

		</button>
	);
}

export default ClearButton;
