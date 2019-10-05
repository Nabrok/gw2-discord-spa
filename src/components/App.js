import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { lazy } from 'react-lazy-no-flicker';

import Loading from './Loading';
import { AuthProvider, Private } from './Auth';
import ApolloProvider from './ApolloProvider';

import 'bootswatch/dist/darkly/bootstrap.min';
//import 'bootswatch/dist/journal/bootstrap.min';

const Main = lazy(() => import('./Main'));

function App() {
	return <BrowserRouter>
		<AuthProvider>
			<React.Suspense fallback={<Loading />}>
				<Private>
					<ApolloProvider>
						<Main />
					</ApolloProvider>
				</Private>
			</React.Suspense>
		</AuthProvider>
	</BrowserRouter>;
}

export default App;
