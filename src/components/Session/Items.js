import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useGW2 } from '../GW2';
import GoldCoins from '../GoldCoins';
import Item from '../Item';
import SectionCard from './SectionCard';

function formatItem(cache) {
	return d => {
		let count = (d.kind === 'E') ? d.rhs - d.lhs : (d.kind === 'D') ? d.lhs : d.rhs;
		if (count < 0 || d.kind === 'D') count *= -1;
		const item = cache.getIn(['items', d.path[1]]);
		const tp_price = cache.getIn(['commerce/prices', d.path[1], 'buys', 'unit_price']);
		const vendor_price = (item && ! item.get('flags').some(f => f === 'NoSell')) ? item.get('vendor_value') : 0;
		const price = (tp_price && tp_price > vendor_price) ? tp_price : vendor_price;
		return {
			id: d.path[1],
			item,
			count,
			price: price * count
		};
	};
}

function ItemList(props) {
	const { title, items } = props;
	const total = items.reduce((total, item) => total + item.price, 0);

	return <SectionCard title={ title } footer={<GoldCoins coins={ total } />}>
		{ items.map(i => <div key={i.id} style={{display: 'inline-block', textAlign: 'center'}}>
			<Item item={i.item} large count={ i.count} />
			<div style={{fontSize: 'x-small'}}><GoldCoins coins={i.price} compact /></div>
		</div>) }
	</SectionCard>;
}

ItemList.propTypes = {
	title: PropTypes.string.isRequired,
	items: PropTypes.array.isRequired
};

function Items(props) {
	const { diff } = props;
	const { cache, getById } = useGW2();

	const items = useMemo(() => diff.filter(d => d.path[0] === 'all_items'), [ diff ]);

	useEffect(() => {
		const ids = items.map(w => w.path[1]);
		getById('items', ids);
		getById('commerce/prices', ids);
		const interval = setInterval(() => getById('commerce/prices', ids, { refresh: true }), 3 * 60 * 1000); // 3 minutes
		return () => {
			clearInterval(interval);
		};
	}, [items, getById]);

	const items_gained = useMemo(() => items.filter(d => (d.kind === 'E' && d.rhs > d.lhs) || d.kind === 'N').map(formatItem(cache)).sort((a,b) => b.price - a.price), [ items, cache ]);
	const items_lost = useMemo(() => items.filter(d => (d.kind === 'E' && d.rhs < d.lhs) || d.kind === 'D').map(formatItem(cache)).sort((a,b) => b.price - a.price), [ items, cache ]);

	return <React.Fragment>
		{ items_gained.length > 0 && <ItemList title="Items Gained" items={ items_gained } /> }
		{ items_lost.length > 0 && <ItemList title="Items Lost" items={ items_lost } /> }
	</React.Fragment>;
}

Items.propTypes = { diff: PropTypes.array.isRequired };

export default Items;
