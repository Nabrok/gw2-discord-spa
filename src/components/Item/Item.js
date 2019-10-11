import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Badge } from 'reactstrap';

import './Style';

function Item(props) {
	const { item, skin = Map(), large = false, count } = props;
	if (! item) return null;

	const icon = skin.has('icon') ? skin.get('icon') : item.get('icon');
	const class_name = large ? 'large' : 'small';
	return <div className="gw2_item" title={item.get('name')}>
		<img src={ icon } className={item.get('rarity') + ' ' + class_name} />
		{ count && <span className="item_badge"><Badge>{count}</Badge></span> }
	</div>;
}

Item.propTypes = {
	item: PropTypes.object,
	skin: PropTypes.object,
	large: PropTypes.bool,
	count: PropTypes.number
};

export default Item;
