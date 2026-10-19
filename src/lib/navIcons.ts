import React from 'react';
import { 
  Bot, 
  Cpu, 
  Layers, 
  Compass, 
  Wrench, 
  BookOpen, 
  ShoppingBag, 
  Sparkles, 
  Phone, 
  Info, 
  HelpCircle, 
  FileText, 
  Grid, 
  Code, 
  GraduationCap, 
  Star, 
  Zap, 
  Award, 
  Boxes, 
  Home, 
  Link as LinkIcon 
} from 'lucide-react';

export const NAV_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Bot,
  Layers,
  Compass,
  Wrench,
  BookOpen,
  ShoppingBag,
  Sparkles,
  Phone,
  Info,
  HelpCircle,
  FileText,
  Grid,
  Code,
  GraduationCap,
  Star,
  Zap,
  Award,
  Boxes,
  Home,
  Link: LinkIcon,
};

export const AVAILABLE_NAV_ICONS = [
  { id: 'Cpu', label: 'Microcontroller / Chip', icon: Cpu },
  { id: 'Bot', label: 'Robot / Kit', icon: Bot },
  { id: 'Layers', label: 'Layers / Lab', icon: Layers },
  { id: 'Compass', label: 'Blueprint / Guide', icon: Compass },
  { id: 'Wrench', label: 'Diagnostics / Tool', icon: Wrench },
  { id: 'BookOpen', label: 'Curriculum / Book', icon: BookOpen },
  { id: 'ShoppingBag', label: 'Store / Shop', icon: ShoppingBag },
  { id: 'Sparkles', label: 'Featured / Special', icon: Sparkles },
  { id: 'GraduationCap', label: 'Academy / Learning', icon: GraduationCap },
  { id: 'Code', label: 'Code / Firmware', icon: Code },
  { id: 'Phone', label: 'WhatsApp / Contact', icon: Phone },
  { id: 'Zap', label: 'Speed / Deals', icon: Zap },
  { id: 'Star', label: 'Highlights / Star', icon: Star },
  { id: 'Boxes', label: 'Catalog / Inventory', icon: Boxes },
  { id: 'Grid', label: 'Categories / Grid', icon: Grid },
  { id: 'Info', label: 'About / Info', icon: Info },
  { id: 'FileText', label: 'Docs / Manual', icon: FileText },
  { id: 'Award', label: 'Certificate / Award', icon: Award },
  { id: 'Home', label: 'Home Page', icon: Home },
  { id: 'Link', label: 'External Link', icon: LinkIcon },
];

export function getNavIcon(name?: string): React.ComponentType<{ className?: string }> {
  if (!name) return LinkIcon;
  return NAV_ICON_MAP[name] || LinkIcon;
}
