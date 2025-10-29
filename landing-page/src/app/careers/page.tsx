import { Suspense } from "react";

import FullPageLoading from "@/components/ui/loading";

import CareersContent from "./page-content";

export default function CareersPage() {
  return (
    <Suspense fallback={<FullPageLoading />}>
      <CareersContent />
    </Suspense>
  );
}
