"use client";

import { useParams } from "next/navigation";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";

export default function ServiceDynamicPage() {
  const { id } = useParams<{ id: string }>();
  return <ServiceDetailPage serviceId={id} />;
}
