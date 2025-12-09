/**
 * Shared Form Component
 * Consistent form styling across all modules
 */

import React from "react";
import { Form as ReactstrapForm, FormProps } from "reactstrap";
import { theme } from "../theme";

export interface SharedFormProps extends FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export const Form: React.FC<SharedFormProps> = ({
  children,
  onSubmit,
  className = "",
  ...props
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <ReactstrapForm
      onSubmit={handleSubmit}
      className={className}
      {...props}
    >
      {children}
    </ReactstrapForm>
  );
};

export default Form;

