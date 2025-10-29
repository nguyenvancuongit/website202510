enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
}

export interface Media {
  id: string;
  path: string;
  type: MediaType;
  size: number;
  name: string;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
