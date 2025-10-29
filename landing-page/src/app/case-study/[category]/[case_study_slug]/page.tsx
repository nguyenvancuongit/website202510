import Image from "next/image";

import { ErrorState } from "@/components/ui/states";
import { getCaseStudy } from "@/services/case-study.service";

interface CaseStudyPageProps {
	params: Promise<{
		category: string;
		case_study_slug: string;
	}>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
	const { case_study_slug } = await params;
	const caseStudy = await getCaseStudy(case_study_slug);

	if (!caseStudy) {
		return (
			<div className="min-h-screen bg-white pt-20">
				<div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
					<ErrorState message="案例未找到或加载失败" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white pt-20">
			<Image
				src={caseStudy.web_thumbnail.path}
				alt={caseStudy.title}
				width={1920}
				height={650}
				className="w-full max-h-[650px] object-cover"
			/>
			<article
				className="max-w-7xl prose prose-slate [&_img]:mx-auto mx-auto px-6 py-16 space-y-16"
				dangerouslySetInnerHTML={{
					__html: caseStudy.content,
				}}
			/>
		</div>
	);
}
