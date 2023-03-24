import { Alignment, AnchorButton, Button, Classes, H4, Navbar } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';

// const titlebar = {
// 	'*'                            : { title: '', menu: [] },
// 	'/'                            : { title: 'Projects', menu: [] },
// 	'/app/[projectCode]/datastore' : { title: 'Datastore', menu: [] },
// 	'/app/[projectCode]/vault'     : { title: 'Vault', menu: [] },
// 	'/app/[projectCode]/livewire'  : { title: 'Livewire', menu: [] },
// 	'/admin'                       : { title: 'Admin', menu: [] },
// };

function Topbar() {
	// const router = useRouter();
	const user = useSelector((s) => s.auth?.session?.user);
	// const { title } = titlebar[router.route] || titlebar['*'];

	const [{ loading }, trigger] = useCmsRequest({
		method : 'post',
		url    : '/v1/auth/logout',
	}, { manual: true });

	const handleClickOnLogout = async () => {
		await trigger();
		window.location = '/login';
	};

	return (
		<Navbar fixedToTop className={styles.container}>
			<Navbar.Group align={Alignment.LEFT}>
				<Navbar.Heading>
					<Link style={{ letterSpacing: 3 }} href="/">
						<strong>SUPA</strong>
						&nbsp;CODE
					</Link>
				</Navbar.Heading>
				<Navbar.Divider />
				<Link legacyBehavior href="/" passHref>
					<AnchorButton minimal icon="home" text="My Projects" />
				</Link>
			</Navbar.Group>
			<Navbar.Group align={Alignment.RIGHT}>
				<Popover2
					placement="bottom-start"
					content={(
						<div className={styles.profile_container}>
							<H4>{user?.name || '-'}</H4>
							<p className={`${Classes.TEXT_SMALL} ${Classes.TEXT_MUTED}`}>{user?.email || '-'}</p>
							<div className={styles.profile_action_container}>
								<Link legacyBehavior href="/admin" passHref>
									<AnchorButton
										minimal
										icon="cog"
										text="Settings"
									/>
								</Link>
								<Button
									onClick={handleClickOnLogout}
									style={{ marginLeft: 8 }}
									loading={loading}
									minimal
									icon="log-out"
									text="Logout"
								/>
							</div>
						</div>
					)}
				>
					<Button minimal icon="user" text={user?.name || 'Profile'} />
				</Popover2>
			</Navbar.Group>
		</Navbar>
	);

	// return (
	// 	<div className={styles.container}>
	// 		<div className={styles.logo_container}>
	// 			<Link href="/" passHref>
	// 				<a
	// 					href="replace"
	// 					className={styles.logo}
	// 				>
	// 					<Logo className={styles.logo_svg} />
	// 				</a>
	// 			</Link>
	// 		</div>
	// 		<div className={styles.title_container}>
	// 			<h1 className={styles.title_text}>{title}</h1>
	// 		</div>
	// 		<div className={styles.topmenu_container}>
	// 			{/* <Link href="/" passHref>
	// 				<a className={styles.action_link} href="replace">
	// 					Projects
	// 				</a>
	// 			</Link> */}
	// 		</div>
	// 		<div className={styles.profile_container}>
	// 				<ClearButton>
	// 					<a href="/admin">Admin Panel</a>
	// 				</ClearButton>
	// 			<Popover2
	// 				placement="bottom-start"
	// 				// caret={false}
	// 				content={(
	// 					<div className={styles.popover_profile_container}>
	// 						<div className={styles.profile_main_content}>
	// 							<div className={styles.profile_avatar}>
	// 								{/* <Avatar size="72px" personName={user ? user.name : ''} /> */}
	// 							</div>
	// 							<div className={styles.profile_text}>
	// 								<h2>
	// 									{user?.name}
	// 								</h2>
	// 								<p>{user?.email}</p>
	// 							</div>
	// 						</div>
	// 						<div className={styles.profile_bottom}>
	// 							<ClearButton onClick={handleClickOnLogout}>
	// 								<div className={styles.logout_container}>
	// 									<IcMLogout width={28} height={28} />
	// 									<span>
	// 										{loading ? 'Logging out...' : 'Logout'}
	// 									</span>
	// 								</div>
	// 							</ClearButton>
	// 						</div>
	// 					</div>
	// 				)}
	// 			>
	// 				<div style={{ cursor: 'pointer' }}>
	// 					Profile
	// 				</div>
	// 			</Popover2>

	// 		</div>
	// 	</div>
	// );
}

export default Topbar;
