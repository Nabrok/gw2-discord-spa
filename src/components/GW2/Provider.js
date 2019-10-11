import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Record, Map, fromJS } from 'immutable';

import Context from './Context';

const GW2Record = Record({
	cache: Map(),
	getById: () => { }
});

function GW2Provider(props) {
	const { children } = props;
	const valueRef = useRef();
	const [ value, setValue ] = useState(GW2Record({
		getById: async (path, ids, options = { }) => {
			// Remove any duplicate ids and filter out anything already cached
			const deduped = [ ...new Set(ids) ];
			let filtered = [ ...deduped ];
			if (! options.refresh) {
				const cached = valueRef.current.getIn(['cache', path]) || Map();
				filtered = deduped.filter(id => ! cached.has(id));
			}
			if (filtered.length === 0) return;

			// Split the list into chunks
			const split_ids = [];
			while (filtered.length) {
				split_ids.push(filtered.splice(0, 200));
			}

			// Get the data from the API
			const results = await Promise.all(split_ids.map(ids => {
				const url = new URL('https://api.guildwars2.com/v2/'+path);
				url.searchParams.append('ids', ids.join(','));
				return fetch(url).then(response => response.json());
			}));

			// Save it into the cache
			const all = results.reduce((t,a) => t.concat(a), []);
			const new_items = all.reduce((t, i) => i.id ? t.set(i.id.toString(), fromJS(i)) : t, Map());
			setValue(
				current => current.updateIn(
					['cache', path],
					curr => curr ? curr.merge(new_items) : new_items
				)
			);
		}
	}));

	// Save the current value to a reference
	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	return <Context.Provider value={ value }>
		{ children }
	</Context.Provider>;
}

GW2Provider.propTypes = {
	children: PropTypes.node
};

export default GW2Provider;
