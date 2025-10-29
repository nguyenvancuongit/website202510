import { api } from "@/lib/fetch";

export interface CareerEducationItem {
  id: string;
  enabled: boolean;
  order: number;
  title: string;
  description?: string;
  bgColor?: string;
  image?: string;
  alt?: string;
}

export interface CareerEducationCategory {
  enabled: boolean;
  order: number;
  name: string;
  icon?: string;
  items: CareerEducationItem[];
}

export interface CareerEducationConfig {
  platform?: CareerEducationCategory;
  device?: CareerEducationCategory;
  training?: CareerEducationCategory;
  consulting?: CareerEducationCategory;
}

export const getCareerEducationConfig = async (): Promise<CareerEducationConfig> => {
  const response = await api.get<CareerEducationConfig>(
    "/system-settings/public/career-education"
  );
  return response.data;
};