import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type CareerEducationConfig,
  careerEducationService,
} from "@/services/career-education.service";

export const CAREER_EDUCATION_QUERY_KEY = ["career-education"];

export function useCareerEducation() {
  return useQuery({
    queryKey: CAREER_EDUCATION_QUERY_KEY,
    queryFn: () => careerEducationService.getConfig(),
  });
}

export function useUpdateCareerEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: CareerEducationConfig) =>
      careerEducationService.updateConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAREER_EDUCATION_QUERY_KEY });
    },
  });
}

