import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Jumbotron } from 'reactstrap';

import Loading from '../Loading';
import GraphQLError from '../GraphQLError';
import MarkDown from '../MarkDown';

import Emblem from './Emblem';

const GET_GUILD = gql`query getGuild($id: ID) {
	gw2 {
		guild(id: $id) {
			id
			name
			tag
			motd
		}
	}
}`;

function GuildSummary(props) {
	const { guild: id } = props;
	const { data, loading, error } = useQuery(GET_GUILD, { variables: { id } });

	if (loading) return <Loading />;
	if (error) return <GraphQLError error={ error } />;

	const guild = data.gw2.guild;

	return <div>
		<h1>
			<Emblem guild={guild.name} />
			{ ' ' }
			[{ guild.tag }]
			{ ' ' }
			{ guild.name }
		</h1>
		{ guild.motd && <Jumbotron><MarkDown>{ guild.motd }</MarkDown></Jumbotron> }
	</div>;
}

GuildSummary.propTypes = {
	guild: PropTypes.string.isRequired
};

export default GuildSummary;
