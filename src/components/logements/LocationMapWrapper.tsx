"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false });

interface LocationMapWrapperProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
}

export default function LocationMapWrapper(props: LocationMapWrapperProps) {
  return <LocationMap {...props} />;
}
