/**
 * Shared Select Component
 * Consistent select/dropdown styling across all modules
 */

import React from "react";
import Select from "react-select";
import { Label } from "reactstrap";
import { theme } from "../theme";

export interface SelectOption {
  label: string;
  value: string | number;
  isDisabled?: boolean;
}

export interface SharedSelectProps {
  label?: string;
  options: SelectOption[] | Array<{ label: string; options: SelectOption[] }>;
  value?: SelectOption | null;
  onChange?: (option: SelectOption | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: string;
  touched?: boolean;
  helperText?: string;
  className?: string;
  classNamePrefix?: string;
  fullWidth?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
}

export const SelectShared: React.FC<SharedSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  isDisabled = false,
  isRequired = false,
  error,
  touched,
  helperText,
  className = "",
  classNamePrefix = "select2-selection",
  fullWidth = false,
  isMulti = false,
  isClearable = false,
  isSearchable = true,
}) => {
  const hasError = touched && !!error;
  const selectId = `select-${Math.random().toString(36).substring(2, 11)}`;

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: theme.borderRadius.md,
      borderColor: hasError ? theme.colors.danger : state.isFocused ? theme.colors.primary : "#ced4da",
      boxShadow: state.isFocused && !hasError ? `0 0 0 0.2rem rgba(64, 81, 137, 0.25)` : "none",
      "&:hover": {
        borderColor: hasError ? theme.colors.danger : theme.colors.primary,
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: theme.borderRadius.md,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? theme.colors.primary
        : state.isFocused
        ? "#f8f9fa"
        : "white",
      color: state.isSelected ? "white" : theme.colors.dark,
      "&:hover": {
        backgroundColor: state.isSelected ? theme.colors.primary : "#f8f9fa",
      },
    }),
  };

  return (
    <div className={fullWidth ? "w-100" : ""}>
      {label && (
        <Label className="form-label">
          {label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </Label>
      )}
      <Select
        inputId={selectId}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        className={`${className} ${hasError ? "is-invalid" : ""}`.trim()}
        classNamePrefix={classNamePrefix}
        styles={customStyles}
      />
      {hasError && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
      {!hasError && helperText && (
        <div className="form-text text-muted">{helperText}</div>
      )}
    </div>
  );
};

export default SelectShared;

