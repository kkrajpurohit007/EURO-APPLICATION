/**
 * Shared Input Component
 * Consistent input styling across all modules
 */

import React from "react";
import { Input as ReactstrapInput, InputProps, FormFeedback, Label } from "reactstrap";
import { theme } from "../theme";

export interface SharedInputProps extends InputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<SharedInputProps> = ({
  label,
  error,
  touched,
  helperText,
  fullWidth = false,
  className = "",
  style,
  ...props
}) => {
  const hasError = touched && !!error;
  const inputId = props.id || props.name || `input-${Math.random().toString(36).substring(2, 11)}`;

  const inputClasses = [
    fullWidth ? "w-100" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputStyle: React.CSSProperties = {
    borderRadius: theme.borderRadius.md,
    ...style,
  };

  return (
    <div className={fullWidth ? "w-100" : ""}>
      {label && (
        <Label for={inputId} className="form-label">
          {label}
          {props.required && <span className="text-danger ms-1">*</span>}
        </Label>
      )}
      <ReactstrapInput
        id={inputId}
        className={inputClasses}
        style={inputStyle}
        invalid={hasError}
        {...props}
      />
      {hasError && (
        <FormFeedback type="invalid">
          {error}
        </FormFeedback>
      )}
      {!hasError && helperText && (
        <div className="form-text text-muted">{helperText}</div>
      )}
    </div>
  );
};

export default Input;

