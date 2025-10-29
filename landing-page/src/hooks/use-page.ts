import { useSearchParams } from "next/navigation"

function usePage(): number {
  const search = useSearchParams()
  const p = Number(search.get("page") || "1")
  return Number.isFinite(p) && p > 0 ? p : 1
}

export default usePage