import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"

import { addressService } from "@/services/address.service"

// Get IP location
export function useIPLocation() {
  return useQuery({
    queryKey: ["ip-location"],
    queryFn: () => addressService.getAddressByIp(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Get all provinces
export function useProvinces(regionName?: string) {
  return useQuery({
    queryKey: ["provinces", regionName],
    queryFn: () => addressService.getProvinces(regionName),
    staleTime: 60 * 60 * 1000, // 1 hour - provinces don't change often
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Get cities for a province
export function useCities(province: string | undefined, cityName?: string) {
  return useQuery({
    queryKey: ["cities", province, cityName],
    queryFn: () => addressService.getCities(province!, cityName),
    enabled: !!province,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Get districts for a province and city
export function useDistricts(province: string | undefined, city: string | undefined) {
  return useQuery({
    queryKey: ["districts", province, city],
    queryFn: () => addressService.getDistricts(province!, city!),
    enabled: !!(province && city),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Custom hook for address auto-initialization
export function useAddressAutoFill(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>,
  isModalOpen: boolean
) {
  // Get IP location when modal opens
  const { data: ipLocation } = useIPLocation();

  // Get provinces list
  const { data: allProvinces = [] } = useProvinces();

  // Get matched province if IP location is available
  const regionName = ipLocation?.flag && typeof ipLocation.data === "object"
    ? ipLocation.data.region_name
    : undefined;

  const { data: matchedProvinces = [] } = useProvinces(regionName);

  // Get cities for matched province
  const matchedProvince = matchedProvinces[0];
  const cityName = ipLocation?.flag && typeof ipLocation.data === "object"
    ? ipLocation.data.city
    : undefined;

  const { data: matchedCities = [] } = useCities(matchedProvince, cityName);

  // Auto-fill form when data is ready
  useEffect(() => {
    if (!isModalOpen || !allProvinces.length) return;

    // If we have a matched province, auto-select it
    if (matchedProvince && !form.getValues("province")) {
      form.setValue("province", matchedProvince);

      // If we also have a matched city, auto-select it
      if (matchedCities.length > 0 && !form.getValues("city")) {
        const matchedCity = matchedCities[0];
        setTimeout(() => {
          form.setValue("city", matchedCity);
        }, 100); // Small delay to ensure province is processed
      }
    }
  }, [isModalOpen, allProvinces, matchedProvince, matchedCities, form]);

  return {
    provinces: allProvinces,
    isAutoFilling: !allProvinces.length,
  };
}