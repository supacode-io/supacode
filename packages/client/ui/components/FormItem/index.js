import styles from './styles.module.css';

import cl from '@/ui/helpers/classnames';

function FormItem({
	className,
	horizontal = false,
	children,
	label,
	labelFor,
}) {
	return (
		<div
			className={cl`
				${className}
				${styles.container}
				${label ? styles.has_label : ''}
				${horizontal ? styles.is_horizontal : ''}
			`}
		>
			{label && (
				<div className={styles.label_container}>
					<label htmlFor={labelFor}>
						{label}
					</label>
				</div>
			)}
			<div className={styles.control_container}>
				{children}
			</div>
		</div>
	);
}

export default FormItem;
