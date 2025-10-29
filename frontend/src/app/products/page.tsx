"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductsMainPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/products/posts");
  }, [router]);

  return null;
}
