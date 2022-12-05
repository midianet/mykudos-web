import { useEffect, useState } from 'react';
import { MuiChipsInput, MuiChipsInputProps} from 'mui-chips-input'; 
import { useField } from '@unform/core';
import { FormHelperTextProps } from '@mui/material';
import { BaseMuiChipsInputProps } from 'mui-chips-input/dist/index.types';


type TVChipProps = MuiChipsInputProps & FormHelperTextProps & BaseMuiChipsInputProps & {
  name: string;
  placeholder: string;
  disabled: boolean
}
export const VShipField: React.FC<TVChipProps> = ({ name, placeholder, disabled, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);
  const [value, setValue] = useState(defaultValue || []);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    });
  }, [registerField, fieldName, value]);


  return (
    <MuiChipsInput
      {...rest}
      error={!!error}
      helperText={error}
      disabled={disabled || false}
      value={value || []}
      placeholder={placeholder|| 'Informe os valores'}
      onChange={e => setValue(e)}
      onKeyDown={() => error && clearError()}
    />
  );
};