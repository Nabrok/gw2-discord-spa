import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Card, CardHeader, Table } from 'reactstrap';

import Loading from './Loading';
import GraphQLError from './GraphQLError';

const GET_ABOUT = gql`query {
	version
	features
}`;

function About() {
	const { data, loading, error } = useQuery(GET_ABOUT);

	if (loading) return <Loading />;
	if (error) return <GraphQLError error={ error } />;

	return <Card>
		<CardHeader>About</CardHeader>
		<Table>
			<tbody>
				<tr>
					<td>Bot Version:</td>
					<td width="100%">{ data.version }</td>
				</tr>
				<tr>
					<td>SPA Version:</td>
					<td width="100%">{ VERSION }</td>
				</tr>
				<tr>
					<td style={{whiteSpace: 'nowrap'}}>Enabled Features:</td>
					<td width="100%">{ data.features.join(', ') }</td>
				</tr>
			</tbody>
		</Table>
	</Card>;
}

export default About;
