import { api } from "@/lib/fetch";

export interface AddressResponse {
  data: string[];
  total: number;
}

export interface IpLocationResponse {
  flag: boolean;
  msg: string;
  data: {
    status: string;
    query: string;
    country: string;
    region_name: string;
    city: string;
    isp: string;
    lat: number;
    lon: number;
    timezone: string;
  };
}

export const addressService = {
  async getProvinces(name?: string): Promise<string[]> {
    const params = new URLSearchParams();
    if (name) params.append("name", name);

    const url = `/public/addresses/provinces${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await api.get<AddressResponse>(url);

    return response.data.data;
  },

  async getCities(province: string, name?: string): Promise<string[]> {
    const params = new URLSearchParams();
    params.append("province", province);
    if (name) params.append("name", name);

    const url = `/public/addresses/cities?${params.toString()}`;
    const response = await api.get<AddressResponse>(url);

    return response.data.data;
  },

  async getDistricts(province: string, city: string, name?: string): Promise<string[]> {
    const params = new URLSearchParams();
    params.append("province", province);
    params.append("city", city);
    if (name) params.append("name", name);

    const url = `/public/addresses/districts?${params.toString()}`;
    const response = await api.get<AddressResponse>(url);

    return response.data.data;
  },

  async getAddressByIp(): Promise<IpLocationResponse> {
    try {
      // Call backend proxy endpoint instead of JYSHARE directly
      const url = "/public/addresses/ip-location";
      const response = await api.get<IpLocationResponse>(url);

      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to get IP location:", error);
      return {
        flag: false,
        msg: "获取IP定位失败",
        data: {
          status: "error",
          query: "",
          country: "",
          region_name: "",
          city: "",
          isp: "",
          lat: 0,
          lon: 0,
          timezone: "",
        },
      };
    }
  },
};

