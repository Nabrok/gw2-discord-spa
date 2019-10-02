import React from 'react';
import { hot } from 'react-hot-loader';
import { Container } from 'reactstrap';

import { Button } from 'reactstrap';

import { useAuth } from './Auth';

function Main() {
	const { logout } = useAuth();

	return <Container>
		<p>Hello World</p>
		<Button onClick={ logout }>Logout</Button>
	</Container>;
}

export default hot(module)(Main);
