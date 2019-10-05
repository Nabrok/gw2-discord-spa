import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

function GraphQLError(props) {
	const { error, ...rest } = props;
	if (! error) return null;
	console.error(error);
	return <Alert color="danger" {...rest}>
		{ error.message ?
			<div>{error.message}</div> :
			error.graphQLErrors.map((error, index) => <div key={index}>{ error.message }</div>)
		}
	</Alert>;
}

GraphQLError.propTypes = {
	error: PropTypes.object
};

export default GraphQLError;
