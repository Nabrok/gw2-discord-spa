import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

import { useGW2 } from '../GW2';
import GoldCoins from '../GoldCoins';
import SectionCard from './SectionCard';

function Wallet(props) {
	const { diff } = props;
	const { cache, getById } = useGW2();

	const wallet = useMemo(() => diff.filter(d => d.path[0] === 'wallet'), [diff]);

	useEffect(() => {
		const ids = wallet.map(w => w.path[1]);
		getById('currencies', ids);
	}, [wallet, getById]);

	if (wallet.length === 0) return null;

	return <SectionCard title="Wallet" body={ false }>
		<Table size="sm" striped>
			<tbody>
				{ wallet.map(c => {
					const value = (c.kind === 'E') ? c.rhs - c.lhs : (c.kind === 'D') ? c.lhs.value * -1 : c.rhs.value;
					const name = cache.getIn(['currencies', c.path[1], 'name']);
					return <tr key={c.path[1]}>
						<td>
							<img src={ cache.getIn(['currencies', c.path[1], 'icon']) } height="25px" />
							{ ' ' }
							{ name }
						</td>
						<td align="right">{ name === 'Coin' ? <GoldCoins coins={value} /> : value.toLocaleString() }</td>
					</tr>;
				}) }
			</tbody>
		</Table>
	</SectionCard>;
}

Wallet.propTypes = { diff: PropTypes.array.isRequired };

export default Wallet;
