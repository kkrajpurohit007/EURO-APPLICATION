/**
 * Shared UI Components Library
 * Centralized exports for consistent UI across all modules
 */

// Theme
export { theme } from "../theme";

// Core UI Components (Theme-consistent)
export { Card, CardBodyShared, CardHeaderShared } from "./Card";
export { Button, ActionButton } from "./Button";
export { Badge, StatusBadge } from "./Badge";
export { CardComponent } from "./CardComponent";
export { Input } from "./Input";
export { SelectShared as Select } from "./Select";
export { Modal } from "./Modal";
export { Form } from "./Form";

// Existing Common Components
export { default as BreadCrumb } from "../../Components/Common/BreadCrumb";
export { default as TableContainer } from "../../Components/Common/TableContainer";
export { default as DeleteModal } from "../../Components/Common/DeleteModal";
export { default as Loader } from "../../Components/Common/Loader";
export { default as Spinner } from "../../Components/Common/Spinner";
export { default as Pagination } from "../../Components/Common/Pagination";
export { default as AttachmentCard } from "../../Components/Common/AttachmentCard";
export { default as MapComponent } from "../../Components/Common/MapComponent";
export { default as NotificationDropdown } from "../../Components/Common/NotificationDropdown";
export { default as ProfileDropdown } from "../../Components/Common/ProfileDropdown";

