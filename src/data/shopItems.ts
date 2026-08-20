import type { ShopItem } from '../types'

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'base-fox', slot: 'base', label: 'Fox (Starter)', emoji: '🦊', cost: 0 },
  { id: 'base-luma', slot: 'base', label: 'Luma the Star Sprite', custom: true, cost: 220 },
  { id: 'base-gengar', slot: 'base', label: 'Gengar', emoji: '👻', cost: 220 },
  { id: 'base-charizard', slot: 'base', label: 'Charizard', emoji: '🐉', cost: 280 },

  { id: 'hat-party', slot: 'hat', label: 'Party Hat', emoji: '🥳', cost: 60 },
  { id: 'hat-cap', slot: 'hat', label: 'Cool Cap', emoji: '🧢', cost: 90 },
  { id: 'hat-grad', slot: 'hat', label: 'Grad Cap', emoji: '🎓', cost: 140 },
  { id: 'hat-crown', slot: 'hat', label: 'Royal Crown', emoji: '👑', cost: 280 },

  { id: 'acc-shades', slot: 'accessory', label: 'Cool Shades', emoji: '🕶️', cost: 60 },
  { id: 'acc-bowtie', slot: 'accessory', label: 'Bow Tie', emoji: '🎀', cost: 80 },
  { id: 'acc-scarf', slot: 'accessory', label: 'Cozy Scarf', emoji: '🧣', cost: 100 },
  { id: 'acc-star', slot: 'accessory', label: 'Star Badge', emoji: '⭐', cost: 160 },

  { id: 'bg-sunset', slot: 'background', label: 'Sunset Glow', gradient: 'from-orange-300 to-pink-400', cost: 100 },
  { id: 'bg-ocean', slot: 'background', label: 'Ocean Wave', gradient: 'from-sky-300 to-blue-500', cost: 100 },
  { id: 'bg-galaxy', slot: 'background', label: 'Galaxy Sparkle', gradient: 'from-purple-400 to-indigo-600', cost: 220 },
  { id: 'bg-rainbow', slot: 'background', label: 'Rainbow Burst', gradient: 'from-pink-400 via-yellow-300 to-emerald-400', cost: 320 },
]

export const SLOT_LABELS: Record<string, string> = {
  base: 'Avatars',
  hat: 'Hats',
  accessory: 'Accessories',
  background: 'Backgrounds',
}

export function itemsForSlot(slot: string) {
  return SHOP_ITEMS.filter((i) => i.slot === slot)
}

export function findItem(id: string | undefined) {
  return SHOP_ITEMS.find((i) => i.id === id)
}
