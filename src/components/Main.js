import React from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { lazy } from 'react-lazy-no-flicker';

import { useBotInfo } from './BotInfo';
import Navbar from './Navbar';
import ErrorBoundary from './ErrorBoundary';

import Home from './Home';
import ApiKey from './ApiKey';
import About from './About';

const WvW = lazy(() => import('./WvW'));

function Main() {
	const { features } = useBotInfo();

	return <ErrorBoundary>
		<Navbar />	
		<br/>
		<Container>
			<ErrorBoundary>
				<Switch>
					<Route exact path="/"><ErrorBoundary><Home /></ErrorBoundary></Route>
					<Route exact path="/key"><ErrorBoundary><ApiKey /></ErrorBoundary></Route>
					{ features.some(f => f === 'wvw_score') && <Route exact path="/wvw"><ErrorBoundary><WvW /></ErrorBoundary></Route> }
					<Route exact path="/about"><ErrorBoundary><About /></ErrorBoundary></Route>
					<Route><h1>Sorry, page not found.</h1></Route>
				</Switch>
			</ErrorBoundary>
		</Container>
	</ErrorBoundary>;
}

export default hot(module)(Main);
