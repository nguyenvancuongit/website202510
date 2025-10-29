export type CategoryLite = { id: string; name: string; slug: string }

export function getCategoryId(category: string, categories: CategoryLite[]): string | undefined {
  const found = categories.find((c) => c.name === category || c.slug === category)
  return found?.id
}

export function getCategoryTitle(category?: string, categories: CategoryLite[] = []): string {
  if (!category) {return "全部文章"}
  const found = categories.find((c) => c.name === category || c.slug === category)
  return found?.name || "全部文章"
}
