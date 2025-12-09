/**
 * Department Sub-Module
 * Self-contained sub-module for Department management
 */

// Components
export { default as DepartmentList } from "./components/DepartmentList";
export { default as DepartmentCreate } from "./components/DepartmentCreate";
export { default as DepartmentEdit } from "./components/DepartmentEdit";

// Slice (Redux)
export {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  selectDepartment,
  clearError,
  selectDepartmentList,
  selectSelectedDepartment,
  selectDepartmentById,
  selectDepartmentLoading,
  selectDepartmentError,
  selectDepartmentTotalCount,
} from "./slice/department.slice";
export { default as departmentReducer } from "./slice/department.slice";

// Types
export type { DepartmentItem, DepartmentsResponse } from "./slice/department.types";

// Service (usually internal, but exported for advanced use cases)
export * as departmentService from "./service/departmentService";

