export const generateSlug = (name: string) => {
  // Simple slug generation - convert Chinese and other characters to a URL-friendly format
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fff]/g, '') // Keep Chinese characters, letters, numbers, and hyphens
    .replace(/\-+/g, '-')
    .replace(/^\-|\-$/g, '');
};
