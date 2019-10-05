import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';

import Loading from './Loading';
import SetKey from './SetKey';
import GraphQLError from './GraphQLError';

const GET_TOKEN = gql`query {
	me {
		id
		token {
			id
			name
			permissions
		}
	}
}`;

function ApiKey() {
	const [ changing, setChanging ] = useState(false);
	const { data, loading, error, refetch } = useQuery(GET_TOKEN);

	const onSet = useCallback(() => {
		setChanging(false);
		refetch();
	}, [refetch]);

	if (loading) return <Loading />;
	if (error) return <GraphQLError error={ error } />;

	const token = data.me.token;

	return <Card>
		<CardHeader>Guild Wars 2 API Key</CardHeader>
		<CardBody>
			{ token && <React.Fragment>
				<p>Your current key is named <b>{token.name}</b> and its permissions are:</p>
				<ul>
					{ token.permissions.map(p => <li key={p}>{p}</li>) }
				</ul>
			</React.Fragment> }
			{ changing ? <SetKey onExpires={() => setChanging(false)} onSet={ onSet } /> : <Button color="primary" onClick={() => setChanging(true)}>{ token ? 'Change' : 'Add' } Key</Button> }
		</CardBody>
	</Card>;
}

export default ApiKey;
