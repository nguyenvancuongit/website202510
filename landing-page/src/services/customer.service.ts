import { api } from "@/lib/fetch";

export interface CustomerPayload {
  name: string;
  email?: string;
  phone: string;
  company?: string;
  address: string;
  cooperationTypes: number[];
  cooperationRequirements: number[];
  title: string;
  requestNote?: string;
}

export interface CustomerResponse {
  id: number;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  address: string;
  cooperationTypes: number[];
  cooperationRequirements: number[];
  title: string;
  requestNote?: string;
  createdAt: string;
  updatedAt: string;
}

export async function createCustomer(
  payload: CustomerPayload
): Promise<CustomerResponse> {
  const response = await api.post<CustomerResponse>(
    "/public/customers",
    payload
  );
  return response.data;
}
