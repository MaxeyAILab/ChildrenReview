import { motion } from 'framer-motion'
import type { AvatarSlot, Progress, ShopItem } from '../types'
import { SHOP_ITEMS, SLOT_LABELS, itemsForSlot } from '../data/shopItems'
import { playCorrect, playTap } from '../lib/sound'
import Companion from '../components/Companion'

interface Props {
  progress: Progress
  updateProgress: (updater: (prev: Progress) => Progress) => void
  onBack: () => void
}

const SLOTS: AvatarSlot[] = ['hat', 'accessory', 'background']

export default function AvatarShopScreen({ progress, updateProgress, onBack }: Props) {
  function handleItemTap(item: ShopItem) {
    const owned = progress.ownedItems.includes(item.id)
    const equipped = progress.equipped[item.slot] === item.id

    if (owned) {
      if (progress.soundOn) playTap()
      updateProgress((prev) => ({
        ...prev,
        equipped: { ...prev.equipped, [item.slot]: equipped ? undefined : item.id },
      }))
      return
    }

    if (progress.coins < item.cost) return

    if (progress.soundOn) playCorrect()
    updateProgress((prev) => ({
      ...prev,
      coins: prev.coins - item.cost,
      ownedItems: [...prev.ownedItems, item.id],
      equipped: { ...prev.equipped, [item.slot]: item.id },
    }))
  }

  return (
    <div className="flex min-h-full flex-col items-center px-4 py-8">
      <button onClick={onBack} className="absolute left-4 top-4 rounded-full bg-white/80 px-4 py-2 font-bold shadow">
        ← Back
      </button>
      <span className="absolute right-4 top-4 rounded-full bg-amber-300 px-4 py-2 font-black text-amber-900 shadow">
        🪙 {progress.coins}
      </span>

      <h1 className="mb-4 mt-4 text-3xl font-black text-white drop-shadow-sm sm:text-4xl">Avatar Shop 🛍️</h1>

      <Companion mood="idle" equipped={progress.equipped} size="lg" />

      <div className="mt-8 flex w-full max-w-2xl flex-col gap-6">
        {SLOTS.map((slot) => (
          <div key={slot}>
            <h2 className="mb-3 text-lg font-extrabold text-white drop-shadow-sm">{SLOT_LABELS[slot]}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {itemsForSlot(slot).map((item) => {
                const owned = progress.ownedItems.includes(item.id)
                const equipped = progress.equipped[item.slot] === item.id
                const affordable = progress.coins >= item.cost

                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleItemTap(item)}
                    disabled={!owned && !affordable}
                    className={`flex min-h-28 flex-col items-center justify-center gap-1 rounded-2xl p-3 shadow-md ${
                      equipped
                        ? 'bg-emerald-400 text-white ring-4 ring-emerald-200'
                        : owned
                          ? 'bg-white text-slate-700'
                          : affordable
                            ? 'bg-white text-slate-700'
                            : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {item.emoji ? (
                      <span className="text-3xl">{item.emoji}</span>
                    ) : (
                      <span className={`h-8 w-8 rounded-full bg-gradient-to-br ${item.gradient}`} />
                    )}
                    <span className="text-center text-xs font-extrabold leading-tight">{item.label}</span>
                    <span className="text-xs font-bold">
                      {equipped ? '✓ Equipped' : owned ? 'Tap to equip' : `🪙 ${item.cost}`}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 max-w-sm text-center text-xs font-semibold text-white/80">
        Owned items: {progress.ownedItems.length} / {SHOP_ITEMS.length} — earn coins by answering correctly in quiz rounds!
      </p>
    </div>
  )
}
