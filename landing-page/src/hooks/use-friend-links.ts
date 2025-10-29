import { useQuery } from "@tanstack/react-query";

import { FriendLink, getFriendLinks } from "@/services/friend-link.service";

export function useFriendLinks() {
  return useQuery<FriendLink[]>({
    queryKey: ["friendLinks"],
    queryFn: getFriendLinks,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}
