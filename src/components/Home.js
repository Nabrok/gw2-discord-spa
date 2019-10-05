import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Loading from './Loading';
import SetKey from './SetKey';

const CHECK_TOKEN = gql`query {
	me {
		id
		token { id }
		gw2 { id name }
	}
}`;

function Home() {
	const [key_key, setKeyKey] = useState(new Date().getTime());
	const { data, loading, refetch } = useQuery(CHECK_TOKEN);

	const onExpires = useCallback(() => {
		setKeyKey(new Date().getTime());
	}, []);

	if (loading) return <Loading />;
	if (data && ! data.me.token) return <SetKey key={ key_key } onExpires={ onExpires } onSet={ refetch } />;

	return <div>Welcome { data && data.me.gw2.name }!</div>;
}

export default Home;
