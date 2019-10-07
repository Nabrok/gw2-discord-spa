import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Record } from 'immutable';

const Context = React.createContext();

const GET_BOT = gql`query {
	bot {
		id
		username
	}
	version
	features
}`;

const BotRecord = Record({
	username: undefined,
	version: undefined,
	features: []
}, 'BotRecord');

function BotInfo(props) {
	const { children } = props;
	const { data } = useQuery(GET_BOT);
	const [ value, setValue ] = useState(BotRecord({}));

	useEffect(() => {
		if (! data) return;
		setValue(BotRecord({
			username: data.bot.username,
			version: data.version,
			features: data.features
		}));
	}, [data, setValue]);

	return <Context.Provider value={value}>{ children }</Context.Provider>;
}

BotInfo.propTypes = {
	children: PropTypes.node
};

export function useBotInfo() {
	const ctx = useContext(Context);

	if (! ctx) throw new Error('BotInfo Provider not found!');

	return ctx;
}

export default BotInfo;
