"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CaseStudiesMainPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/case-studies/posts");
  }, [router]);

  return null;
}
