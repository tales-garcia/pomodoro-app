import { Field, useField } from 'formik';
import React from 'react';

import { Container } from './styles';

interface SwitchProps {
  name: string;
}

const Switch: React.FC<SwitchProps> = ({ name }) => {
  const [{ value }] = useField(name);

  return (
    <Container checked={Number(value)}>
      <Field type="checkbox" name={name} id={name} />
      <label htmlFor={name}>
        <span />
      </label>
    </Container>
  );
}

export default Switch;