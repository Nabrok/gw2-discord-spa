import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';

function SectionCard(props) {
	const { title, footer, children, body = true, ...rest } = props;
	let className = props.className || '';
	if (! className.split(/\s+/).some(c => /^mb-\d+$/.test(c))) className += ' mb-3';
	return <Card className={className} style={{textTransform: 'capitalize', height: '100%'}} {...rest}>
		<CardHeader>{title}</CardHeader>
		{body ? <CardBody>{children}</CardBody> : children}
		{footer && <CardFooter>{footer}</CardFooter>}
	</Card>;
}

SectionCard.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	body: PropTypes.bool,
	footer: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node
	]),
	className: PropTypes.string
};

export default SectionCard;
