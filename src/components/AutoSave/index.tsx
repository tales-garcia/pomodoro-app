import { useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';

const AutoSave: React.FC = () => {
    const { values, submitForm } = useFormikContext();
    const ref = useRef<boolean>(true);

    useEffect(() => {
        if (ref.current) {
            ref.current = false;
            return;
        }

        submitForm();
    }, [values]);

    return null;
}

export default AutoSave;