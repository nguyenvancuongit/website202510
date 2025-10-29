import { useQuery } from "@tanstack/react-query"

import { getCaseStudy, getListCaseStudies } from "@/services/case-study.service"
import { getCategories } from "@/services/categories.service"

export const useCaseStudies = ({ categoryId, page, enabled }: {
    page: number, categoryId?: string,
    enabled?: boolean
}) => {
    return useQuery({
        queryKey: ["case-studies", page, categoryId],
        queryFn: () => getListCaseStudies({ page, categoryId }),
        enabled: enabled,
    })
}

export const useCaseStudyCategory = () => {
    return useQuery({
        queryKey: ["case-study-categories"],
        queryFn: () => getCategories("case-study"),
    })
}

export const useCaseStudyDetail = (slug: string) => {

    return useQuery({
        queryKey: ["case-study", slug],
        queryFn: () => getCaseStudy(slug),
        enabled: !!slug,
    })
}