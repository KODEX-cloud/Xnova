import {
  Car, Home, Wrench, Info, BookOpen, Phone, User, Menu,
  CarFront, Building2, Key, Layers, Settings, MapPin, Warehouse,
  Plus, LayoutDashboard, Star, Shield, Zap, Heart, Target,
  CheckCircle, Globe, Clock, Award, Users, TrendingUp,
  Truck, Package, Headphones, Camera, CreditCard,
  FileText, Lock, Mail, Search, Share2, ThumbsUp,
  Fuel, Gauge, Wrench as Repair, ParkingSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Car, Home, Wrench, Info, BookOpen, Phone, User, Menu,
  CarFront, Building2, Key, Layers, Settings, MapPin, Warehouse,
  Plus, LayoutDashboard, Star, Shield, Zap, Heart, Target,
  CheckCircle, Globe, Clock, Award, Users, TrendingUp,
  Truck, Package, Headphones, Camera, CreditCard,
  FileText, Lock, Mail, Search, Share2, ThumbsUp,
  Fuel, Gauge, ParkingSquare,
  Repair,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Settings;
}
