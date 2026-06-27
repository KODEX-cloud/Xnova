"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [prop, setProp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/properties/${id}`).then(r => r.json()).then(data => { setProp(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Modifier : {prop?.title}</h1>
      <PropertyForm initialData={prop} propId={id} />
    </div>
  );
}
