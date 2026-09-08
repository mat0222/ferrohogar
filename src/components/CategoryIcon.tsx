import {
  BrickWall,
  Droplets,
  Hammer,
  Home,
  Leaf,
  Paintbrush,
  ShowerHead,
  Snowflake,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  hammer: Hammer,
  brick: BrickWall,
  paint: Paintbrush,
  zap: Zap,
  droplet: Droplets,
  leaf: Leaf,
  screw: Wrench,
  home: Home,
  shower: ShowerHead,
  snow: Snowflake,
  wrench: Wrench,
}

export function CategoryIcon({ name, size = 28 }: { name: string; size?: number }) {
  const Icon = map[name] ?? Hammer
  return <Icon size={size} strokeWidth={1.75} />
}
