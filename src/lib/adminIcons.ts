import {
  Database,
  Zap,
  Sparkles,
  BarChart2,
  Paintbrush,
  type LucideIcon,
} from "lucide-react";

export interface IconOption {
  name: string;
  Icon: LucideIcon;
  label: string;
}

export const ICON_OPTIONS: IconOption[] = [
  { name: "Database",   Icon: Database,   label: "Database"    },
  { name: "Zap",        Icon: Zap,        label: "Performance" },
  { name: "Sparkles",   Icon: Sparkles,   label: "AI"          },
  { name: "BarChart2",  Icon: BarChart2,  label: "Analytics"   },
  { name: "Paintbrush", Icon: Paintbrush, label: "Design"      },
];

export const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.name, o.Icon]),
);
