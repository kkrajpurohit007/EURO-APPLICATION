/**
 * Department Service
 * Self-contained API service for department operations
 */

import { APIClient } from "../../../../helpers/api_helper";
import * as url from "../../../../helpers/url_helper";
import {
  getDepartments,
  addNewDepartment,
  updateDepartment as updateDepartmentFake,
  deleteDepartment as deleteDepartmentFake,
} from "../../../../helpers/fakebackend_helper";
import { DepartmentItem, DepartmentsResponse } from "../slice/department.types";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllDepartments = (
  pageNumber: number = 1,
  pageSize: number = 50
): Promise<DepartmentsResponse> => {
  if (isFakeBackend) {
    return getDepartments(pageNumber, pageSize) as unknown as Promise<DepartmentsResponse>;
  }
  return api.get(url.GET_DEPARTMENTS, {
    pageNumber,
    pageSize,
  }) as unknown as Promise<DepartmentsResponse>;
};

export const createDepartment = (data: Partial<DepartmentItem>): Promise<DepartmentItem> => {
  if (isFakeBackend) {
    return addNewDepartment(data) as unknown as Promise<DepartmentItem>;
  }
  return api.create(url.POST_DEPARTMENT, data) as unknown as Promise<DepartmentItem>;
};

export const updateDepartment = (
  id: string,
  data: Partial<DepartmentItem>
): Promise<DepartmentItem> => {
  if (isFakeBackend) {
    return updateDepartmentFake(id, data) as unknown as Promise<DepartmentItem>;
  }
  return api.put(url.PUT_DEPARTMENT + "/" + id, data) as unknown as Promise<DepartmentItem>;
};

export const deleteDepartment = (id: string): Promise<void> => {
  if (isFakeBackend) {
    return deleteDepartmentFake(id) as unknown as Promise<void>;
  }
  return api.delete(url.DELETE_DEPARTMENT + "/" + id) as unknown as Promise<void>;
};

