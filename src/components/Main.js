import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { lazy } from 'react-lazy-no-flicker';

import { GW2Provider } from './GW2';
import ApolloProvider from './ApolloProvider';
import BotInfo, { useBotInfo } from './BotInfo';
import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';
import Loading from './Loading';

const Home = lazy(() => import('./Home'));
const WvW = lazy(() => import('./WvW'));
const ApiKey = lazy(() => import('./ApiKey'));
const About = lazy(() => import('./About'));
const Session = lazy(() => import('./Session'));

function Routes() {
	const { features } = useBotInfo();
	return <React.Suspense fallback={<Loading />}>
		<Switch>
			<Route exact path="/"><ErrorBoundary><Home /></ErrorBoundary></Route>
			<Route exact path="/key"><ErrorBoundary><ApiKey /></ErrorBoundary></Route>
			{ features.some(f => f === 'wvw_score') && <Route exact path="/wvw"><ErrorBoundary><WvW /></ErrorBoundary></Route> }
			{ features.some(f => f === 'session') && <Route exact path="/session"><Session /></Route> }
			<Route exact path="/about"><ErrorBoundary><About /></ErrorBoundary></Route>
			<Route><h1>Sorry, page not found.</h1></Route>
		</Switch>
	</React.Suspense>;
}

function Main() {
	return <ErrorBoundary>
		<ApolloProvider>
			<GW2Provider>
				<BotInfo>
					<Navbar />	
					<br/>
					<Container>
						<ErrorBoundary>
							<Routes />
						</ErrorBoundary>
					</Container>
				</BotInfo>
			</GW2Provider>
		</ApolloProvider>
	</ErrorBoundary>;
}

export default hot(module)(Main);
