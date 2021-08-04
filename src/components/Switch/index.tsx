import React, { useEffect, useState } from 'react';

import { Container } from './styles';

interface SwitchProps {
  onChange?(checked: boolean): void;
  name: string;
}

const Switch: React.FC<SwitchProps> = ({ onChange, name }) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    if (!!onChange) {
      onChange(value);
    }
  }, [value]);

  return (
    <Container checked={Number(value)}>
      <input value={`${value}`} onChange={ev => setValue(ev.currentTarget.checked)} type="checkbox" name={name} id={name} />
      <label htmlFor={name}>
        <span />
      </label>
    </Container>
  );
}

export default Switch;