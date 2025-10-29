import { api } from "@/lib/fetch";

export interface FriendLink {
  id: string;
  name: string;
  url: string;
  sort_order: number;
}

export async function getFriendLinks(): Promise<FriendLink[]> {
  const response = await api.get<FriendLink[]>("/public/friend-links");
  return response.data;
}
