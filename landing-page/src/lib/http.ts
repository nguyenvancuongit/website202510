export function withQuery(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!params) { return path }
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") { sp.set(k, String(v)) }
  })
  const qs = sp.toString()
  return qs ? `${path}?${qs}` : path
}
