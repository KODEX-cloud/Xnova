import { ContactProps } from "@/lib/types/page-builder";
import { prisma } from "@/lib/prisma";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default async function CmsContact({ props }: { props: ContactProps }) {
  const {
    heading = "Contactez-nous",
    subheading = "Notre équipe est disponible pour vous accompagner",
  } = props;

  let phone = "", email = "", address = "";
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ["phone", "email", "address"] } },
    });
    rows.forEach((r) => {
      if (r.key === "phone") phone = r.value || "";
      if (r.key === "email") email = r.value || "";
      if (r.key === "address") address = r.value || "";
    });
  } catch {}

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label inline-flex items-center gap-2 mb-4">
            <Mail className="h-3.5 w-3.5" /> Contact
          </span>
          {heading && <h2 className="text-3xl font-black text-gray-900 mb-3">{heading}</h2>}
          {subheading && <p className="text-gray-500 max-w-xl mx-auto">{subheading}</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-3 p-5 bg-orange-50 border-2 border-orange-200 rounded-2xl hover:border-nova-red/40 transition-all group">
              <div className="w-11 h-11 bg-nova-red rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Téléphone</p>
                <p className="text-gray-800 font-bold text-sm">{phone}</p>
              </div>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-3 p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl hover:border-blue-400 transition-all group">
              <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Email</p>
                <p className="text-gray-800 font-bold text-sm">{email}</p>
              </div>
            </a>
          )}
          {address && (
            <div className="flex items-center gap-3 p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl">
              <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Adresse</p>
                <p className="text-gray-800 font-bold text-sm">{address}</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-nova-red to-nova-orange text-white font-bold rounded-full hover:shadow-xl hover:shadow-nova-red/30 hover:scale-105 transition-all"
          >
            Ouvrir le formulaire de contact
          </Link>
        </div>
      </div>
    </section>
  );
}
