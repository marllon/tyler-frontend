import { api } from "@/utils/api";
import type {
  Goal,
  GoalCreateRequest,
  GoalUpdateRequest,
  GoalPageResponse,
  GoalFilters,
} from "@/types";

export async function getGoals(
  filters?: GoalFilters
): Promise<GoalPageResponse> {
  const params: Record<string, any> = {};

  if (filters?.page !== undefined) params.page = filters.page;
  if (filters?.pageSize) params.pageSize = filters.pageSize;
  if (filters?.status) params.status = filters.status;
  if (filters?.activeOnly !== undefined) params.activeOnly = filters.activeOnly;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.sortDirection) params.sortDirection = filters.sortDirection;
  if (filters?.cursor) params.cursor = filters.cursor;

  const response = await api.get<GoalPageResponse>("/goals", params);
  return response;
}

export async function getGoalById(id: string): Promise<Goal> {
  const response = await api.get<Goal>(`/goals/${id}`);
  return response;
}

export async function createGoal(data: GoalCreateRequest): Promise<Goal> {
  const response = await api.post<Goal>("/goals", data);
  return response;
}

export async function updateGoal(
  id: string,
  data: GoalUpdateRequest
): Promise<Goal> {
  const response = await api.put<Goal>(`/goals/${id}`, data);
  return response;
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`);
}

export async function uploadGoalImage(
  id: string,
  file: File
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<{ imageUrl: string }>(
    `/goals/${id}/upload-image`,
    formData
  );
  return response;
}

export async function deleteGoalImage(id: string): Promise<void> {
  await api.delete(`/goals/${id}/image`);
}

export async function addAmountToGoal(
  id: string,
  amount: number
): Promise<Goal> {
  const response = await api.patch<Goal>(`/goals/${id}/add-amount`, undefined, {
    amount,
  });
  return response;
}
