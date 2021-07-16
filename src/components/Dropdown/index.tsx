import React from 'react';
import Select, { ActionMeta } from 'react-select';

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
  return (
    <Select
      isSearchable
      hideSelectedOptions
      {...props}
    />
  );
}

export default Dropdown;
