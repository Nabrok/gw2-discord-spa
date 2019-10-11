import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { lazy } from 'react-lazy-no-flicker';

import Loading from './Loading';
import { AuthProvider, Private } from './Auth';

import './style';

const Main = lazy(() => import('./Main'));

function App() {
	return <BrowserRouter>
		<AuthProvider>
			<React.Suspense fallback={<Loading />}>
				<Private>
					<Main />
				</Private>
			</React.Suspense>
		</AuthProvider>
	</BrowserRouter>;
}

export default App;
