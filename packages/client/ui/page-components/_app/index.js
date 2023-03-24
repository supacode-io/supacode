import { FocusStyleManager } from '@blueprintjs/core';
import { Provider } from 'react-redux';

import Layout from './Layout';
import SessionCheck from './SessionCheck';

import store from '@/ui/store';

FocusStyleManager.onlyShowFocusOnTabs();

function MyApp({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<SessionCheck>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionCheck>
		</Provider>
	);
}

export default MyApp;
