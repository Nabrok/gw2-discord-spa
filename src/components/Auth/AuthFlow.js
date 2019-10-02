import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ClientOAuth2 from 'client-oauth2';
import { Switch, Route } from 'react-router-dom';
import { Alert } from 'reactstrap';

import useAuth from './useAuth';

function Login(props) {
	const { discordAuth } = props;

	useEffect(() => {
		sessionStorage.setItem('location', window.location.pathname);
		window.location.href = discordAuth.token.getUri();
	}, [discordAuth.token]);

	return <div>Authenticating ...</div>;
}

Login.propTypes = {
	discordAuth: PropTypes.object.isRequired
};

function Auth(props) {
	const { discordAuth } = props;
	const { setAuth } = useAuth();

	useEffect(() => {
		discordAuth.token.getToken(window.location.href).then(setAuth);
	}, [discordAuth.token, setAuth]);

	return <div>Authenticating ...</div>;
}

Auth.propTypes = {
	discordAuth: PropTypes.object.isRequired
};

function AuthFlow() {
	const [ discordAuth, setDiscordAuth ] = useState();
	const [ error, setError ] = useState();

	useEffect(() => {
		fetch('/oauth2.json').then(res => res.json()).then(json => {
			if (! /\/auth$/.test(json.redirectUri)) throw new Error('redirectUri must end in /auth');
			setDiscordAuth(new ClientOAuth2({
				authorizationUri: "https://discordapp.com/api/oauth2/authorize",
				scopes: ['identify'],
				...json
			}));
		}).catch(err => setError(err.message));
	}, []);

	if (error) return <Alert color="danger">{ error }</Alert>;

	if (! discordAuth) return null;

	return <Switch>
		<Route exact path="/auth"><Auth discordAuth={ discordAuth } /></Route>
		<Route><Login discordAuth={ discordAuth } /></Route>
	</Switch>;
}

export default AuthFlow;
