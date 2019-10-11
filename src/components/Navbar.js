import React, { useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Link, useRouteMatch } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavLink, NavbarBrand, NavbarToggler, Collapse, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { useAuth } from './Auth';
import { useBotInfo } from './BotInfo';

const GET_ME = gql`query {
	me {
		id
		username
		token { id permissions }
	}
}`;

function Item(props) {
	const { to, children } = props;
	const active = useRouteMatch(to);

	return <NavItem active={ !! active }>
		<NavLink tag={Link} to={to}>{ children }</NavLink>
	</NavItem>;
}

Item.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};

function MyNavbar() {
	const { data } = useQuery(GET_ME);
	const { logout } = useAuth();
	const bot = useBotInfo();

	const [ collapse_open, setCollapseOpen ] = useState(false);

	return <Navbar dark color="primary" expand="sm">
		<NavbarBrand tag={Link} to="/">{ bot.username }</NavbarBrand>
		<NavbarToggler onClick={() => setCollapseOpen(current => ! current)} />
		<Collapse isOpen={collapse_open} navbar>
			<Nav navbar>
				{ bot.features.some(f => f === 'session') && <Item to="/session">Session</Item> }
				{ bot.features.some(f => f === 'wvw_score') && <Item to="/wvw">WvW</Item> }
				<Item to="/about">About</Item>
			</Nav>
			{ data && <Nav className="ml-auto" navbar>
				<UncontrolledDropdown nav inNavbar>
					<DropdownToggle nav caret>{ data.me.username }</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem tag={Link} to="/key">Guild Wars 2 API Key</DropdownItem>
						<DropdownItem divider />
						<DropdownItem onClick={logout}>Logout</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</Nav> }
		</Collapse>
	</Navbar>;
}

export default MyNavbar;
