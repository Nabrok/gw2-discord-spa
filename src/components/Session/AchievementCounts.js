import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'reactstrap';

import { useGW2 } from '../GW2';
import SectionCard from './SectionCard';

const WVW_ACHIEVEMENT_CATEGORY = '13';
const PVP_ACHIEVEMENT_CATEGORY = '3';

function Counts(props) {
	const { diff } = props;
	const { cache, getById } = useGW2();

	useEffect(() => {
		const ids = diff.map(d => d.path[1]);
		getById('achievements', ids);
	}, [ diff, getById ]);

	return <Table size="sm">
		<tbody>
			{ diff.map(d => {
				const details = cache.getIn(['achievements', d.path[1]]);
				if (! details) return null;
				return <tr key={d.path[1]}>
					<td>{ details.get('requirement') }</td>
					<td align="right">{ (d.rhs - d.lhs).toLocaleString() }</td>
				</tr>;
			})}
		</tbody>
	</Table>;
}

Counts.propTypes = { diff: PropTypes.array.isRequired };

function AchievementCounts(props) {
	const { diff } = props;
	const { cache, getById } = useGW2();

	useEffect(() => {
		getById('achievements/categories', [WVW_ACHIEVEMENT_CATEGORY, PVP_ACHIEVEMENT_CATEGORY]);
	}, [getById]);

	const achievements = useMemo(() => diff.filter(d => d.path[0] === 'achievements' && d.path[2] === 'current'), [diff]);

	const wvw_category = cache.getIn(['achievements/categories', WVW_ACHIEVEMENT_CATEGORY]);
	const wvw_achievements = useMemo(() => {
		if (! wvw_category) return [];
		return achievements.filter(d => {
			const ach_ids = wvw_category.get('achievements');
			if (!ach_ids) return false;
			return ach_ids.some(aid => aid === parseInt(d.path[ 1 ]));
		});
	}, [achievements, wvw_category]);

	const pvp_category = cache.getIn(['achievements/categories', PVP_ACHIEVEMENT_CATEGORY]);
	const pvp_achievements = useMemo(() => {
		if (! pvp_category) return [];
		return achievements.filter(d => {
			const ach_ids = pvp_category.get('achievements');
			if (!ach_ids) return false;
			return ach_ids.some(aid => aid === parseInt(d.path[ 1 ]));
		});
	}, [achievements, pvp_category]);

	if (achievements.length === 0) return null;

	const grid_setup = { xs: 12, className: 'mb-3' };
	if (wvw_achievements.length && pvp_achievements.length) grid_setup.md = 6;

	return <Row>
		{ wvw_achievements.length > 0 && <Col {...grid_setup }><SectionCard title="World vs World" body={ false }>
			<Counts diff={wvw_achievements} />
		</SectionCard></Col> }
		{ pvp_achievements.length > 0 && <Col {...grid_setup }><SectionCard title="Player vs Player" body={ false }>
			<Counts diff={pvp_achievements} />
		</SectionCard></Col> }
	</Row>;
}

AchievementCounts.propTypes = { diff: PropTypes.array.isRequired };

export default AchievementCounts;
