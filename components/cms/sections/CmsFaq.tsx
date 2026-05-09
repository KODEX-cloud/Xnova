"use client";

import { useState } from "react";
import { FaqProps } from "@/lib/types/page-builder";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function CmsFaq({ props }: { props: FaqProps }) {
  const {
    heading = "Questions fréquentes",
    subheading = "Tout ce que vous devez savoir sur nos services",
    items = [],
  } = props;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            <span className="section-label inline-flex items-center gap-2 mb-4">
              <HelpCircle className="h-3.5 w-3.5" /> FAQ
            </span>
            {heading && <h2 className="text-3xl font-black text-gray-900 mb-3">{heading}</h2>}
            {subheading && <p className="text-gray-500">{subheading}</p>}
          </div>
        )}

        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                open === i ? "border-nova-red/30 shadow-lg shadow-orange-100" : "border-gray-100"
              }`}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-nova-red flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
