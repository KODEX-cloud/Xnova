"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CarForm from "@/components/admin/CarForm";

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then((r) => r.json())
      .then((data) => { setCar(data); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-nova-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Modifier : {car?.title}</h1>
      <CarForm initialData={car} carId={id} />
    </div>
  );
}
