import { httpClient } from "@/lib/http-client";

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
  platform: CareerEducationCategory;
  device: CareerEducationCategory;
  training: CareerEducationCategory;
  consulting: CareerEducationCategory;
}

export const careerEducationService = {
  /**
   * Get career education configuration (admin endpoint)
   */
  async getConfig(): Promise<CareerEducationConfig> {
    const response = await httpClient.get<CareerEducationConfig>(
      "/system-settings/career-education"
    );
    return response;
  },

  /**
   * Update career education configuration
   */
  async updateConfig(config: CareerEducationConfig): Promise<CareerEducationConfig> {
    const response = await httpClient.post<CareerEducationConfig>(
      "/system-settings/career-education",
      config
    );
    return response;
  },
};
