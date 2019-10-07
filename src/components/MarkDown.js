import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import showdown from 'showdown';

const converter = new showdown.Converter({
	simplifiedAutoLink: true,
	openLinksInNewWindow: true,
	literalMidWordUnderscores: true,
	strikethrough: true,
	tables: true,
	tasklists: true,
	emoji: true
});

function MarkDown(props) {
	const { children } = props;

	const html = useMemo(() => {
		return converter.makeHtml(children);
	}, [children]);

	return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

MarkDown.propTypes = {
	children: PropTypes.string
};

export default MarkDown;
