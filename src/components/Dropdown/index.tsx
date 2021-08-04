import { useField } from 'formik';
import React, { useCallback, useMemo } from 'react';
import Select, { ActionMeta } from 'react-select';
import { useTheme } from 'styled-components';
import { Error } from '../Input/styles';

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
  defaultValue?: DropdownOption;
  value?: DropdownOption;
  name: string;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
  const { red, blue, text, darkBlue } = useTheme();
  const [field, meta, helpers] = useField(props.name);
  const value = useMemo(() => props.options.find(option => option.value === field.value), [field.value]);

  const handleChange: (((value: DropdownOption | null, actionMeta: ActionMeta<DropdownOption>) => void) & ((value: DropdownOption | null, action: ActionMeta<any>) => void)) = useCallback((option) => {
    if (!option) return;
    helpers.setValue(option.value);
  }, [field]);

  return (
    <>
      <Select
        isSearchable
        hideSelectedOptions
        {...props}
        onChange={handleChange}
        value={value}
        onBlur={field.onBlur}
        menuPlacement="auto"
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
              borderColor: (meta.touched && meta.error) ? '#ff0033' : state.isFocused ? red : blue
            },
            borderColor: (meta.touched && meta.error) ? '#ff0033' : state.isFocused ? red : blue,
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
            padding: 15,
            ':active': ({})
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
      {(meta.touched && meta.error) && <Error>{meta.error}</Error>}
    </>
  );
}

export default Dropdown;
