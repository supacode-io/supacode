import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles.module.css';

import { useCmsRequest } from '@/external-packages/request';
import { markSessionInitialized, setSession } from '@/ui/store/auth';

const PUBLIC_PAGES = [
	'/login',
];

function SessionCheck({ children }) {
	const [isRedirected, setIsRedirected] = useState(false);
	const [isClient, setIsClient] = useState(false);

	const dispatch = useDispatch();
	const auth = useSelector((s) => s.auth);
	const cookieSessionId = Cookies.get('sess_token');

	const [, trigger] = useCmsRequest({
		method : 'GET',
		url    : '/v1/auth/session',
	}, { manual: true });

	const router = useRouter();

	useEffect(() => {
		router.prefetch('/login');
	}, [router]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsClient(true);
		}
	}, [router]);

	useEffect(() => {
		(async () => {
			if (isClient) {
				if (cookieSessionId && (!auth.sessionId || !auth.session)) {
					let res;
					try {
						res = await trigger();
					} catch {
						res = null;
					}
					const { sessionId, session } = res?.data || {};
					if (sessionId && session) {
						dispatch(setSession({ sessionId, session }));
					}
				}
				if (!auth.sessionInitialized) {
					dispatch(markSessionInitialized());
				}
			}
		})();
	}, [auth.session, auth.sessionId, auth.sessionInitialized, cookieSessionId, dispatch, isClient, trigger]);

	useEffect(() => {
		if (auth.sessionInitialized) {
			(async () => {
				if ((!auth.session || !auth.sessionId)
					&& !PUBLIC_PAGES.includes(router.route)
				) {
					await router.push('/login');
				}
				setIsRedirected(true);
			})();
		}
	}, [auth.session, auth.sessionId, auth.sessionInitialized, router]);

	if (!auth.sessionInitialized && !isRedirected) {
		<div className={styles.container}>
			{!auth.sessionInitialized && 'Initializing Session ...'}
			{!isRedirected && 'Redirecting ...'}
		</div>;
	}

	return (children);
}

export default SessionCheck;
