import {
  FaBorderAll,
  FaDroplet,
  FaFire,
  FaLeaf,
  FaCircleDot,
  FaMortarPestle,
  FaGlassWater,
  FaSeedling,
  FaStore,
} from 'react-icons/fa6'
import type { ComponentType } from 'react'

type IconComponent = ComponentType<{ className?: string }>

const ICON_MAP: Record<string, IconComponent> = {
  all:           FaBorderAll,
  oils:          FaDroplet,
  camphor:       FaFire,
  vibhuti:       FaLeaf,
  kumkum:        FaCircleDot,
  'pooja-powder': FaMortarPestle,
  'paneer-water': FaGlassWater,
  'pooja-oils':   FaDroplet,
  'castor-oils':  FaDroplet,
  'neem-oils':    FaSeedling,
  'jar-camphor':  FaFire,
  'katti-camphor': FaFire,
}

export function getCategoryIcon(slug: string): IconComponent {
  return ICON_MAP[slug] ?? FaStore
}
