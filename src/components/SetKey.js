import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useInput } from './Form';
import GraphQLError from './GraphQLError';

const REQUEST_CODE = gql`query { tokenCode { code expires } }`;

const SET_KEY = gql`mutation setApiKey($key: String) {
	setApiKey(key: $key) { name }
}`;

function SetKey(props) {
	const { onExpires, onSet } = props;
	const { data, loading, error } = useQuery(REQUEST_CODE, { fetchPolicy: 'network-only' });
	const [ setApiKey, { error: set_key_error } ] = useMutation(SET_KEY);
	const key_input = useInput('');
	const [ enabled, setEnabled ] = useState(false);

	const { code, expires } = data && data.tokenCode ? data.tokenCode : { };

	const onSubmit = useCallback(e => {
		e.preventDefault();
		setApiKey({ variables: { key: e.target.key.value } }).then(onSet);
	}, [onSet, setApiKey]);

	useEffect(() => {
		if (! expires) return;
		const now = new Date().getTime();
		const timeout = setTimeout(onExpires, expires - now);
		return () => {
			clearTimeout(timeout);
		};
	}, [expires, onExpires]);

	useEffect(() => {
		setEnabled(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{20}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(key_input.value));
	}, [key_input.value]);

	if (loading) return null;
	if (error) return <GraphQLError error={ error } />;

	return <React.Fragment>
		<p>
			Create a key at <a href="https://account.arena.net/applications" target="_new">https://account.arena.net/applications</a>.
			The key name must contain the code <b>{ code }</b>.
			This code will expire at { new Date(expires).toLocaleTimeString() }.
		</p>
		<Form onSubmit={ onSubmit } inline>
			<FormGroup className="mb-2 mr-sm-2 mb-sm-0">
				<Label className="mr-sm-2" for="key">API Key:</Label>
				<Input type="text" name="key" id="key" maxLength="74" size="80" placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" { ...key_input } />
			</FormGroup>
			<Button type="submit" color="primary" disabled={ ! enabled }>Apply Key</Button>
		</Form>
		<GraphQLError error={set_key_error} className="mt-3" />
	</React.Fragment>;
}

SetKey.propTypes = {
	onExpires: PropTypes.func.isRequired,
	onSet: PropTypes.func
};

export default SetKey;
