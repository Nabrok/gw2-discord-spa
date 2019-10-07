import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Row, Col, Card, CardHeader, Table, Nav, NavItem, NavLink } from 'reactstrap';

import Loading from './Loading';
import GraphQLError from './GraphQLError';

const GET_MATCH = gql`query {
	gw2 {
		world {
			match { id tier region }
		}
	}
}`;

const GET_WVW = gql`query WvWScores($map: WvWMap) {
	gw2 {
		world {
			match {
				id
				scores(map: $map) {
					color
					worlds { name }
					skirmish
					victory_points
					ppt
					kills
					deaths
				}
			}
		}
	}
}`;

const colors = {
	red: '#880000',
	blue: '#000088',
	green: '#008800'
};

function WvWTabs(props) {
	const { map, setMap } = props;
	return <Nav tabs className="mb-3">
		<NavItem><NavLink active={map === 'all'} onClick={() => setMap('all')}>All Maps</NavLink></NavItem>
		<NavItem><NavLink active={map === 'Center'} onClick={() => setMap('Center')}>Eternal Battleground</NavLink></NavItem>
		<NavItem><NavLink active={map === 'GreenHome'} onClick={() => setMap('GreenHome')}>Green Border</NavLink></NavItem>
		<NavItem><NavLink active={map === 'BlueHome'} onClick={() => setMap('BlueHome')}>Blue Border</NavLink></NavItem>
		<NavItem><NavLink active={map === 'RedHome'} onClick={() => setMap('RedHome')}>Red Border</NavLink></NavItem>
	</Nav>;
}

WvWTabs.propTypes = {
	map: PropTypes.string,
	setMap: PropTypes.func
};

function Scores(props) {
	const { map } = props;
	const { data, loading, error, refetch } = useQuery(GET_WVW, {
		pollInterval: 30000,
		variables: { map }
	});

	useEffect(() => {
		refetch();
	}, [map, refetch]);

	if (loading) return <Loading />;
	if (error) return <GraphQLError error={ error } />;

	const match = data.gw2.world.match;

	return <Row>
		{ match.scores.sort((a,b) => b.victory_points - a.victory_points || b.skirmish - a.skirmish).map(score => <Col key={score.color} sm={12} md={4}>
			<Card className="mb-3">
				<CardHeader style={{backgroundColor: colors[score.color]}}>
					{ score.worlds.map(w => <div key={w.name}>{ w.name }</div>) }
				</CardHeader>
				<Table>
					<tbody>
						<tr>
							<td>Victory Points:</td>
							<td align="right">{ score.victory_points.toLocaleString() }</td>
						</tr>
						<tr>
							<td>Skirmish Score:</td>
							<td align="right">{ score.skirmish.toLocaleString() }</td>
						</tr>
						<tr>
							<td>PPT:</td>
							<td align="right">+{ score.ppt.toLocaleString() }</td>
						</tr>
						<tr>
							<td>Kills:</td>
							<td align="right">{ score.kills.toLocaleString() }</td>
						</tr>
						<tr>
							<td>Deaths:</td>
							<td align="right">{ score.deaths.toLocaleString() }</td>
						</tr>
						<tr>
							<td>K/D Ratio:</td>
							<td align="right">{ (score.kills / score.deaths).toLocaleString() }</td>
						</tr>
					</tbody>
				</Table>
			</Card>
		</Col>) }
	</Row>;
}

Scores.propTypes = {
	map: PropTypes.string
};

function WvW() {
	const [ map, setMap ] = useState('all');
	const { data, loading, error } = useQuery(GET_MATCH);

	if (loading) return <Loading />;
	if (error) return <GraphQLError error={ error } />;

	const match = data.gw2.world.match;

	return <div>
		<h1>{ match.region } - Tier { match.tier }</h1>
		<WvWTabs map={ map } setMap={ setMap } />
		<Scores map={ map } />
	</div>;
}

export default WvW;
