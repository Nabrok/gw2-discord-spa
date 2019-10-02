import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Record } from 'immutable';

import Context from './Context';

const AuthRecord = Record({
	accessToken: null,
	expires: null,
	setAuth: () => { },
	logout: () => { }
});

function Provider(props) {
	const { children } = props;

	const [ value, setValue ] = useState(() => {
		const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : {};
		if (token.expires) token.expires = new Date(token.expires);
		if (token.expires && token.expires < new Date()) {
			localStorage.removeItem('token');
			delete token.accessToken;
			delete token.expires;
		}
		return AuthRecord({
			...token,
			setAuth: ({ accessToken, expires }) => {
				localStorage.setItem('token', JSON.stringify({ accessToken, expires }));
				setValue(current => current.set('accessToken', accessToken).set('expires', expires));
			},
			logout: () => {
				localStorage.removeItem('token');
				setValue(current => current.delete('accessToken').delete('expires'));
			}
		});
	});

	useEffect(() => {
		if (! value.expires) return;
		const now = new Date();
		const expire_timeout = setTimeout(value.logout, Math.max(value.expires - now, 0));
		return () => {
			clearTimeout(expire_timeout);
		};
	}, [value.expires, value.logout]);

	return <Context.Provider value={value}>
		{ children }
	</Context.Provider>;
}

Provider.propTypes = {
	children: PropTypes.node
};

export default Provider;
