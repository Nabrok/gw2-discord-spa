import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Loading from './Loading';
import GraphQLError from './GraphQLError';
import SetKey from './SetKey';
import GuildSummary from './Guild/Summary';

const CHECK_TOKEN = gql`query {
	me {
		id
		token { id }
		gw2 { id name }
	}
	gw2 {
		guild {
			id
		}
	}
}`;

function Home() {
	const [key_key, setKeyKey] = useState(new Date().getTime());
	const { data, loading, error, refetch } = useQuery(CHECK_TOKEN);

	const onExpires = useCallback(() => {
		setKeyKey(new Date().getTime());
	}, []);

	if (loading) return <Loading />;
	if (error) return <GraphQLError error={ error } />;

	return <div>
		{ data.gw2.guild && <GuildSummary guild={ data.gw2.guild.id } /> }
		{ data.me.token ? <div>
			Welcome { data && data.me.gw2.name }!
		</div> : <SetKey key={ key_key } onExpires={ onExpires } onSet={ refetch } /> }
	</div>;
}

export default Home;
