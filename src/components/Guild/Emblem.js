import React from 'react';
import PropTypes from 'prop-types';

function GuildEmblem(props) {
	const { size = 150, guild } = props;

	const emblem_url = `https://guilds.gw2w2w.com/guilds/${guild.toLowerCase().replace(/\s/g, '-')}/${size}.svg`;

	return <img src={emblem_url} style={{backgroundColor: '#fff', borderRadius: '10px', verticalAlign: 'text-bottom'}} />;
}

GuildEmblem.propTypes = {
	guild: PropTypes.string.isRequired,
	size: PropTypes.number
};

export default GuildEmblem;
