import { useContext } from 'react';

import Context from './Context';

function useGW2() {
	const ctx = useContext(Context);

	if (! ctx) throw new Error('GW2 Provider not found');

	return ctx;
}

export default useGW2;
