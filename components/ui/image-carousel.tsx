"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCard {
  id: string;
  src: string;
  alt: string;
  rotation: number;
}

interface ImageCarouselProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  onCtaClick?: () => void;
  images: ImageCard[];
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export function ImageCarousel({
  title,
  subtitle,
  description,
  ctaText,
  onCtaClick,
  images,
  features = [],
}: ImageCarouselProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotatingCards, setRotatingCards] = useState<number[]>([]);

  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)));
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((angle) => (angle + 0.4) % 360));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Animated background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nova-red/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-nova-orange/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        {/* Carousel Container */}
        <div
          className="relative w-full max-w-6xl h-80 sm:h-[420px] mb-12"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Rotating Image Cards */}
          <div className="absolute inset-0 flex items-center justify-center perspective">
            {images.map((image, index) => {
              const angle = (rotatingCards[index] || 0) * (Math.PI / 180);
              const radius = 200;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * (radius * 0.4);

              const perspectiveX = isHovering
                ? (mousePosition.x - 0.5) * 15
                : 0;
              const perspectiveY = isHovering
                ? (mousePosition.y - 0.5) * 15
                : 0;

              return (
                <div
                  key={image.id}
                  className="absolute w-32 h-44 sm:w-40 sm:h-52 transition-all duration-300"
                  style={{
                    transform: `
                      translate(${x}px, ${y}px)
                      rotateX(${perspectiveY}deg)
                      rotateY(${perspectiveX}deg)
                      rotateZ(${image.rotation}deg)
                    `,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className={cn(
                      "relative w-full h-full rounded-2xl overflow-hidden shadow-2xl",
                      "transition-all duration-300 hover:shadow-nova-red/30 hover:scale-110",
                      "cursor-pointer group"
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 128px, 160px"
                    />
                    {/* Red shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-nova-red/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Border glow */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-nova-red/0 group-hover:ring-nova-red/60 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-20 text-center max-w-2xl mx-auto mb-12">
          {subtitle && (
            <p className="text-nova-red text-sm font-semibold uppercase tracking-widest mb-3">
              {subtitle}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-white/60 mb-8">{description}</p>

          <button
            onClick={onCtaClick}
            className={cn(
              "inline-flex items-center gap-2 px-8 py-3 rounded-full",
              "bg-gradient-to-r from-nova-red to-nova-orange text-white font-semibold",
              "hover:shadow-lg hover:shadow-nova-red/30 hover:scale-105 transition-all duration-300",
              "active:scale-95 focus:outline-none group"
            )}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="relative z-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "text-center p-6 rounded-xl",
                  "bg-white/5 backdrop-blur-sm border border-white/10",
                  "hover:bg-white/10 hover:border-nova-red/30 transition-all duration-300",
                  "group"
                )}
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-nova-red transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageCarousel;
