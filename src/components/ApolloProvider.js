import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { Alert } from 'reactstrap';

import { useAuth } from './Auth';

function Provider(props) {
	const { children, graphql = '/graphql.json' } = props;
	const [ graphql_config, setGraphQLConfig ] = useState();
	const [ client, setClient ] = useState();
	const { accessToken } = useAuth();
	const [ error, setError ] = useState();

	useEffect(() => {
		if (graphql instanceof Object) {
			setGraphQLConfig(graphql);
			return;
		}
		fetch(graphql).then(response => response.json()).then(setGraphQLConfig).catch(err => setError(`Error loading ${graphql}: ${err.message}`));
	}, [graphql]);

	useEffect(() => {
		if (! graphql_config) return;
		const httpLink = createHttpLink(graphql_config);
		const authLink = setContext((_, { headers }) => ({
			headers: { ...headers, authorization: accessToken ? `Bearer ${accessToken}` : '' }
		}));
		setClient(new ApolloClient({
			cache: new InMemoryCache(),
			link: authLink.concat(httpLink)
		}));
	}, [graphql_config, accessToken]);

	if (error) return <Alert color="danger">{ error }</Alert>;
	if (! client) return null;

	return <ApolloProvider client={ client }>
		{ children }
	</ApolloProvider>;
}

Provider.propTypes = {
	children: PropTypes.node,
	graphql: PropTypes.oneOf([
		PropTypes.string,
		PropTypes.object
	])
};

export default Provider;
