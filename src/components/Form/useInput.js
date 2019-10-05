import { useState, useCallback } from 'react';

function useInput(default_value) {
	const [ value, setValue ] = useState(default_value);

	const onChange = useCallback(e => {
		setValue(e.target.value);
	}, []);

	return { value, onChange };
}

export default useInput;
