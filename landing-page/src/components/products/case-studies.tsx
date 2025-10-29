import { connection } from "next/server"

import CaseStudiesSection from "@/components/common/case-studies-section"
import { tryCatch } from "@/lib/utils";
import { getListCaseStudies } from "@/services/case-study.service";


export default async function CaseStudies({
  className = ""
}) {
  await connection();
  const [caseStudiesRes] = await tryCatch(getListCaseStudies({
    limit: 2
  }))

  const caseStudies = caseStudiesRes?.data.map((caseStudy) => ({
    description: caseStudy.highlight_description,
    title: caseStudy.title,
    image: caseStudy.web_thumbnail.path,
    slug: caseStudy.slug,
    categorySlug: caseStudy.category.slug,
  })) ?? []

  return (
    <CaseStudiesSection
      className={className}
      title='合作案例'
      buttonText='合作咨询'
      cases={caseStudies}
    />
  )
}
