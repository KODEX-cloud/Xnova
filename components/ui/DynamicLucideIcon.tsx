import * as Icons from "lucide-react";

interface Props {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicLucideIcon({ name, className, size = 20 }: Props) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    const Fallback = Icons.HelpCircle;
    return <Fallback className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
}
