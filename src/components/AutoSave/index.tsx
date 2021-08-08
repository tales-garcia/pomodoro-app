import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';

const AutoSave: React.FC = () => {
    const { values, submitForm } = useFormikContext();

    useEffect(() => {
        submitForm();
    }, [values]);

    return null;
}

export default AutoSave;