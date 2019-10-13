import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useGW2 } from '../GW2';
import SectionCard from './SectionCard';
import './achievements_style';

function Achievement(props) {
	const { category, id } = props;
	const { cache } = useGW2();

	const details = cache.getIn(['achievements', id.toString()]);
	if (! details) return null;

	return <div className="achievement">
		<div title={category.get('name')} className="ach_icon"><img src={category.get('icon')} /></div>
		<p className="lead">{ details.get('name') }</p>
		<p className="text-muted">{ details.get('requirement') }</p>
	</div>;
}

Achievement.propTypes = { id: PropTypes.number.isRequired, category: PropTypes.object.isRequired };

function Achievements(props) {
	const { diff } = props;
	const { cache, getById } = useGW2();

	const achievements = useMemo(() => diff.filter(d => d.path[0] === 'achievements' && ((d.kind === 'N' && d.rhs.done) || (d.kind === 'E' && d.path[2] === 'done'))), [diff]);

	useEffect(() => {
		if (achievements.length === 0) return;
		getById('achievements/categories', ['all']);
	}, [achievements, getById]);

	useEffect(() => {
		const ids = achievements.map(d => d.path[1]);
		getById('achievements', ids);
	}, [achievements, getById]);

	const categories = cache.get('achievements/categories');
	if (! categories) return null;

	if (achievements.length === 0) return null;

	const filterIds = id => achievements.some(a => parseInt(a.path[1]) === id);

	return <SectionCard title="Achievements">
		{ categories.filter(category => category.get('achievements').some(filterIds)).valueSeq().toArray().map(category => <div key={category.get('id')}>
			{ category.get('achievements').filter(filterIds).map(id => <Achievement key={id} id={id} category={category} />) }
		</div>) }
	</SectionCard>;
}

Achievements.propTypes = { diff: PropTypes.array.isRequired };

export default Achievements;
