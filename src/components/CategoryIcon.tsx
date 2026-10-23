import {
  CupSoda,
  Dna,
  Droplets,
  Dumbbell,
  Fish,
  Flame,
  GlassWater,
  Leaf,
  Pill,
  Weight,
  Zap,
  Cookie,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  GlassWater,
  Zap,
  Weight,
  Dna,
  Flame,
  Pill,
  Fish,
  Dumbbell,
  Droplets,
  Cookie,
  Leaf,
  CupSoda,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Component = ICONS[icon] ?? Dumbbell;
  return <Component className={className} aria-hidden="true" />;
}
