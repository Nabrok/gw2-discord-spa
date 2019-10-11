import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useGW2 } from '../GW2';
import SectionCard from './SectionCard';

function Titles(props) {
	const { ids } = props;
	const { cache, getById } = useGW2();

	useEffect(() => {
		getById('titles', ids);
	}, [getById, ids]);

	if (ids.length === 0) return null;

	return <p>Titles gained: { ids.map(id => cache.getIn(['titles', id.toString(), 'name'])).join(', ') }</p>;
}

Titles.propTypes = { ids: PropTypes.array.isRequired };

function Characters(props) {
	const { diff } = props;
	const characters = diff.filter(d => d.path[0] === 'characters').reduce((t, c) => {
		if (! t[c.path[1]]) t[c.path[1]] = {};
		if (c.path[2] === 'age') t[c.path[1]].played = Math.round((c.rhs - c.lhs) / 60);
		if (c.path[2] === 'deaths') t[c.path[1]].deaths = c.rhs - c.lhs;
		if (c.path[2] === 'level') t[c.path[1]].levels = c.rhs - c.lhs;
		return t;
	}, {});
	const account = diff.filter(d=> d.path[0] === 'account');

	const wvw_rank_gain = account.find(d => d.path[1] === 'wvw_rank');
	const fractal_level_gain = account.find(d => d.path[1] === 'fractal_level');

	const titles = useMemo(() => diff.filter(d => d.path[0] === 'titles').map(d => d.path[1]), [diff]);

	return <SectionCard title="Characters">
		{ wvw_rank_gain && <p>Gained { (wvw_rank_gain.rhs - wvw_rank_gain.lhs).toLocaleString() } WvW ranks.</p>}
		{ fractal_level_gain && <p>Gained { (fractal_level_gain.rhs - fractal_level_gain.lhs).toLocaleString() } fractal levels.</p>}
		<Titles ids={titles} />
		{ Object.entries(characters).map(([name, stats]) => <div key={name}>
			<b><i><u>{ name }</u></i></b>
			<ul>
				<li>Played for {stats.played} minutes.</li>
				{ stats.levels && <li>Gained {stats.levels} levels.</li> }
				{ stats.deaths && <li>Died {stats.deaths} times.</li> }
			</ul>
		</div>) }
	</SectionCard>;
}

Characters.propTypes = { diff: PropTypes.array.isRequired };

export default Characters;
