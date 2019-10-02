import React from 'react';
import { usePastDelay } from 'react-lazy-no-flicker';

function Loading() {
	const past_delay = usePastDelay();
	if (! past_delay) return null;
	return <div>Loading ...</div>;
}

export default Loading;
