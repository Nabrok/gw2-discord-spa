import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Row, Col, Alert } from 'reactstrap';

import Loading from '../Loading';
import GraphQLError from '../GraphQLError';

import Characters from './Characters';
import Wallet from './Wallet';
import Items from './Items';
import AchievementCounts from './AchievementCounts';
import Achievements from './Achievements';
import Unlocks from './Unlocks';

const GET_SESSION = gql`query getSession {
	me {
		id
		token {
			id
			permissions
		}
	}
	last_session {
		start_time
		stop_time
		diff
	}
}`;

const recommended_permissions = [ 'progression', 'wallet', 'characters', 'unlocks', 'inventories', 'pvp' ];

function Session() {
	const { data, loading, error, refetch } = useQuery(GET_SESSION, {
		fetchPolicy: 'cache-and-network'
	});

	const stop_time = data ? data.last_session.stop_time : undefined;

	useEffect(() => {
		if (! stop_time) return;
		const now = new Date().getTime();
		const stopped = new Date(stop_time).getTime();
		if (stopped < now - (5 * 60 * 1000)) return;
		const timeout = setTimeout(refetch, 5 * 60 * 1000);
		return () => {
			clearTimeout(timeout);
		};
	}, [ stop_time, refetch ]);

	if (loading) return <Loading />;
	if (error) return <GraphQLError error={ error } />;

	const session = data.last_session;
	if (! session) return <div>No session data found.</div>;

	const set_permissions = data.me.token.permissions;
	const missing_permissions = recommended_permissions.filter(p => ! set_permissions.some(sp => sp === p));
	return <div>
		{ missing_permissions.length > 0 && <Alert color="warning">
			<p>Your API key is missing the following permissions:</p>
			<ul>{ missing_permissions.map(p => <li key={p}>{p}</li>) }</ul>
			<p>Update your key to get additional information in this report.</p>
		</Alert> }
		<p>{ new Date(session.start_time).toLocaleString() } - { new Date(session.stop_time).toLocaleString() }</p>
		{ session.diff && <React.Fragment>
			<Row>
				<Col className="mb-3" xs={12} md={6}><Characters diff={session.diff} /></Col>
				<Col className="mb-3" xs={12} md={6}><Wallet diff={session.diff} /></Col>
			</Row>
			<Items diff={session.diff} />
			<AchievementCounts diff={session.diff} />
			<Achievements diff={session.diff} />
			<Unlocks diff={session.diff} />
		</React.Fragment> }
	</div>;
}

export default Session;
