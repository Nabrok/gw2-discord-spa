import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

class ErrorBoundary extends React.Component {
	state = { has_error: false };

	static propTypes = {
		children: PropTypes.node
	};

	static getDerivedStateFromError() {
		return { has_error: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error(error, errorInfo);
	}

	render() {
		if (this.state.has_error) return <Alert color="danger"><h1>Something went wrong</h1></Alert>;

		return this.props.children;
	}
}

export default ErrorBoundary;
