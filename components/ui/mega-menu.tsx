"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type MegaMenuItem = {
  id: number;
  label: string;
  subMenus?: {
    title: string;
    items: {
      label: string;
      description: string;
      icon: React.ElementType;
      href?: string;
    }[];
  }[];
  link?: string;
};

export interface MegaMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  items: MegaMenuItem[];
  className?: string;
}

const MegaMenu = React.forwardRef<HTMLUListElement, MegaMenuProps>(
  ({ items, className, ...props }, ref) => {
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);
    const [isHover, setIsHover] = React.useState<number | null>(null);

    return (
      <ul
        ref={ref}
        className={`relative flex items-center space-x-0 ${className || ""}`}
        {...props}
      >
        {items.map((navItem) => (
          <li
            key={navItem.label}
            className="relative"
            onMouseEnter={() => setOpenMenu(navItem.label)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            {navItem.link ? (
              <a
                href={navItem.link}
                className="relative flex cursor-pointer items-center justify-center gap-1 py-1.5 px-4 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-nova-red rounded-full group"
                onMouseEnter={() => setIsHover(navItem.id)}
                onMouseLeave={() => setIsHover(null)}
              >
                <span>{navItem.label}</span>
                {isHover === navItem.id && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 size-full bg-orange-50"
                    style={{ borderRadius: 99 }}
                  />
                )}
              </a>
            ) : (
              <button
                className="relative flex cursor-pointer items-center justify-center gap-1 py-1.5 px-4 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-nova-red rounded-full group"
                onMouseEnter={() => setIsHover(navItem.id)}
                onMouseLeave={() => setIsHover(null)}
              >
                <span className="relative z-10">{navItem.label}</span>
                {navItem.subMenus && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 relative z-10 transition-transform duration-300 ${
                      openMenu === navItem.label ? "rotate-180 text-nova-red" : ""
                    }`}
                  />
                )}
                {(isHover === navItem.id || openMenu === navItem.label) && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 size-full bg-orange-50"
                    style={{ borderRadius: 99 }}
                  />
                )}
              </button>
            )}

            <AnimatePresence>
              {openMenu === navItem.label && navItem.subMenus && (
                <div className="absolute left-0 top-full w-auto pt-3 z-50">
                  <motion.div
                    className="w-max bg-white border border-gray-100 rounded-2xl p-5 shadow-xl shadow-gray-200/80"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <div className="flex w-fit shrink-0 space-x-8 overflow-hidden">
                      {navItem.subMenus.map((sub) => (
                        <div className="w-full" key={sub.title}>
                          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-nova-red">
                            {sub.title}
                          </h3>
                          <ul className="space-y-3">
                            {sub.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <li key={item.label}>
                                  <a
                                    href={item.href || "#"}
                                    className="flex items-start space-x-3 group rounded-xl p-2 hover:bg-orange-50 transition-colors duration-150"
                                  >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-nova-red group-hover:text-white">
                                      <Icon className="h-4 w-4 flex-none" />
                                    </div>
                                    <div className="leading-5 min-w-[140px]">
                                      <p className="text-sm font-semibold text-gray-800 group-hover:text-nova-red transition-colors">
                                        {item.label}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                                        {item.description}
                                      </p>
                                    </div>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    );
  }
);

MegaMenu.displayName = "MegaMenu";

export default MegaMenu;
