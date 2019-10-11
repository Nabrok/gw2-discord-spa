import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import { useGW2 } from '../GW2';
import SectionCard from './SectionCard';

import '../Item/Style';

function Item(props) {
	const { id, type } = props;
	const { cache } = useGW2();

	const item = cache.getIn([type, id]);
	if (! item) return null;

	return <div className="gw2_item" title={item.get('name')}>
		<img className={item.get('rarity')+' large'} src={item.get('icon')} />
	</div>;
}

Item.propTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired
};

function Unlock(props) {
	const { ids, type } = props;
	const { getById } = useGW2();

	useEffect(() => {
		getById(type, ids);
	}, [ids, type, getById]);

	return <SectionCard title={type}>
		{ ids.map(id => <Item key={id} id={id.toString()} type={type} />) }
	</SectionCard>;
}

Unlock.propTypes = {
	ids: PropTypes.array.isRequired,
	type: PropTypes.string.isRequired
};

function Dye(props) {
	const { id } = props;
	const { cache } = useGW2();

	const item = cache.getIn(['colors', id]);
	if (! item) return null;

	return <div className="gw2_item" title={item.get('name')}>
		<div className={'item large ' + item.getIn(['categories', 2])} style={{
			backgroundColor: 'rgb('+item.getIn(['cloth', 'rgb']).join(',')+')'
		}}>
			{ item.get('name') }
		</div>
	</div>;
}

Dye.propTypes ={ id: PropTypes.string.isRequired };

function Dyes(props) {
	const { dyes } = props;
	const { getById } = useGW2();

	useEffect(() => {
		getById('colors', dyes);
	}, [dyes, getById]);

	console.log(dyes);

	return <SectionCard title="Dyes">
		{ dyes.map(id => <Dye key={id} id={id.toString()} />)}
	</SectionCard>;
}

Dyes.propTypes = { dyes: PropTypes.array.isRequired };

function Unlocks(props) {
	const { diff } = props;

	const unlocks = useMemo(() => ['skins', 'minis', 'outfits', 'finishers'].map(type => diff.filter(d => d.path[0] === type)).filter(t => t.length > 0), [diff]);
	const dyes = useMemo(() => diff.filter(d => d.path[0] === 'dyes').map(d => d.path[1]), [diff]);
	const count = unlocks.length + (dyes.length ? 1 : 0);

	const grid_setup = { xs: 12, className: 'mb-3' };
	if (count >= 3) grid_setup.lg = 4;
	if (count >= 2) grid_setup.sm = 6;

	return <Row>
		{ unlocks.map(unlock => <Col key={ unlock[0].path[0] } {...grid_setup}>
			<Unlock ids={unlock.map(u => u.path[1])} type={ unlock[0].path[0] } />
		</Col>) }
		{ dyes.length > 0 && <Col {...grid_setup}><Dyes dyes={dyes} /></Col> }
	</Row>;
}

Unlocks.propTypes = { diff: PropTypes.array.isRequired };

export default Unlocks;
