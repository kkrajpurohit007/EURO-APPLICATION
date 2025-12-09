/**
 * Shared Modal Component
 * Consistent modal styling across all modules
 */

import React from "react";
import {
  Modal as ReactstrapModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "reactstrap";
import { Button } from "./Button";
import { theme } from "../theme";

export interface SharedModalProps extends Omit<ModalProps, "toggle"> {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  showCancel?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  centered?: boolean;
}

export const Modal: React.FC<SharedModalProps> = ({
  title,
  children,
  footer,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  showCancel = true,
  size = "md",
  centered = true,
  className = "",
  ...props
}) => {
  const modalClasses = [
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const defaultFooter = (
    <>
      {showCancel && (
        <Button variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
      )}
      {onConfirm && (
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      )}
    </>
  );

  return (
    <ReactstrapModal
      isOpen={props.isOpen}
      toggle={onClose}
      size={size}
      centered={centered}
      className={modalClasses}
      {...props}
    >
      {title && (
        <ModalHeader toggle={onClose}>
          {title}
        </ModalHeader>
      )}
      <ModalBody>
        {children}
      </ModalBody>
      {(footer !== undefined || onConfirm) && (
        <ModalFooter>
          {footer !== undefined ? footer : defaultFooter}
        </ModalFooter>
      )}
    </ReactstrapModal>
  );
};

export default Modal;

