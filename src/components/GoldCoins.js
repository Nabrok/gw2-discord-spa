import React from 'react';
import PropTypes from 'prop-types';

const gold_icon = 'https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png';
const silver_icon = 'https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png';
const copper_icon = 'https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png';

const coins_in_gold = 10000;
const coins_in_silver = 100;

const img_style = { height: '1em' };

function GoldCoins(props) {
	const { compact = false } = props;
	let coins = props.coins;

	const negative = (coins < 0);
	if (negative) coins = coins * -1;
	const gold = Math.floor(coins / coins_in_gold);
	const silver = Math.floor((coins - (gold * coins_in_gold)) / coins_in_silver);
	const copper = coins - (gold * coins_in_gold) - (silver * coins_in_silver);
	const show_copper = (! compact || gold === 0);

	return <span>
		{ negative && '-' }
		{ gold > 0 && <React.Fragment>
			{ gold }
			{ ! compact && ' ' }
			<img src={ gold_icon } title="gold" style={ img_style } />
			{ ! compact && ' ' }
		</React.Fragment> }
		{ (silver > 0 || gold > 0) && <React.Fragment>
			{ silver }
			{ ! compact && ' ' }
			<img src={ silver_icon } title="silver" style={ img_style } />
			{ ! compact && ' ' }
		</React.Fragment> }
		{ show_copper && <React.Fragment>
			{ copper }
			{ ! compact && ' ' }
			<img src={ copper_icon } title="copper" style={ img_style } />
		</React.Fragment> }
	</span>;
}

GoldCoins.propTypes = {
	coins: PropTypes.number.isRequired,
	compact: PropTypes.bool
};

export default GoldCoins;
