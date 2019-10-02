import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { lazy } from 'react-lazy-no-flicker';

import useAuth from './useAuth';

const AuthFlow = lazy(() => import('./AuthFlow'));

function Private(props) {
	const { children } = props;
	const { accessToken } = useAuth();

	if (! accessToken) return <AuthFlow />;

	const to = sessionStorage.getItem('location') || "/";

	return <Switch>
		<Redirect exact from="/auth" to={ to } />
		<Route>{ children }</Route>
	</Switch>;
}

Private.propTypes = {
	children: PropTypes.node
};

export default Private;
