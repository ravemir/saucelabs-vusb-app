/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Styles from './Switch.module.css';

interface SwitchInterface {
  checked: boolean;
  disabled?: boolean;
  error?: boolean;
  label: string;
  name?: string;
  onChange: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<SwitchInterface> = ({
  checked,
  disabled,
  error,
  label,
  name,
  onChange,
}) => {
  return (
    <>
      <label
        className={`${Styles.switchContainer} ${
          disabled ? Styles.disabled : ''
        } ${checked ? Styles.checked : ''} ${error ? Styles.error : ''}`}
      >
        <input
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          className={Styles.switchCheckbox}
          type="checkbox"
          {...(name ? { name } : {})}
        />
        <span className={Styles.switchButton} />
        <span
          className={`${Styles.switchLabel} ${
            disabled ? Styles.switchLabelDisabled : ''
          }`}
        >
          {label}
        </span>
      </label>
    </>
  );
};

export default Switch;