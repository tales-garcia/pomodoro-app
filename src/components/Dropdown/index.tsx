import React from 'react';
import Select, { ActionMeta } from 'react-select';
import { useTheme } from 'styled-components';

type DropdownOption = {
  label: string,
  value: string
};

interface DropdownProps {
  options: DropdownOption[];
  placeholder: string;
  noOptionsMessage?: ((obj: {
    inputValue: string;
  }) => string | null);
  onChange?: (((value: DropdownOption | null, actionMeta: ActionMeta<DropdownOption>) => void) & ((value: DropdownOption | null, action: ActionMeta<DropdownOption>) => void)) | undefined;
  defaultValue?: DropdownOption;
  value?: DropdownOption;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
  const { red, blue, text, darkBlue } = useTheme();

  return (
    <Select
      isSearchable
      hideSelectedOptions
      {...props}
      styles={{
        control: (base, state) => ({
          ...base,
          backgroundColor: blue,
          borderWidth: 2,
          borderRadius: 8,
          font: '500 1rem Montserrat, sans-serif',
          outline: 0,
          padding: 15,
          ':hover': {
            ...base[':hover'],
            borderColor: state.isFocused ? red : blue
          },
          borderColor: state.isFocused ? red : blue,
          boxShadow: 'none'
        }),
        container: base => ({
          ...base,
          border: 0,
          outline: 0,
          width: '100%'
        }),
        menu: base => ({
          ...base,
          backgroundColor: blue,
          overflow: 'hidden',
          borderRadius: 8
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: base => ({
          ...base,
          color: text,
          ':hover': {
            opacity: 0.8
          },
          padding: 0
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused ? darkBlue : blue,
          font: '500 1rem Montserrat, sans-serif',
          padding: 15
        }),
        singleValue: base => ({
          ...base,
          color: text,
          font: '500 1rem Montserrat, sans-serif'
        }),
        placeholder: base => ({
          ...base,
          font: '400 1rem Montserrat, sans-serif',
          color: `${text}70`,
          margin: 0
        }),
        input: base => ({
          ...base,
          color: text,
          font: '500 1rem Montserrat, sans-serif',
          margin: 0
        }),
        valueContainer: base => ({ ...base, padding: 0 }),
        menuList: base => ({ ...base, padding: 0 }),
        noOptionsMessage: base => ({ ...base, padding: 15 })
      }}
    />
  );
}

export default Dropdown;
