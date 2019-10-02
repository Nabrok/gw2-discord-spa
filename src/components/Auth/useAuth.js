import { useContext } from 'react';

import Context from './Context';

function useAuth() {
	const ctx = useContext(Context);

	if (! ctx) throw new Error("No Auth Provider!");

	return ctx;
}

export default useAuth;
