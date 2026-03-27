'use client'

import { motion, AnimatePresence } from 'framer-motion'

function HeartIcon({ filled }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

export default function Gallery({ images, selectedIds, onToggleSelect, onOpenLightbox }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      <AnimatePresence>
        {images.map((image, index) => {
          const isSelected = selectedIds.has(image.id)
          return (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="break-inside-avoid relative group"
              onContextMenu={e => e.preventDefault()}
            >
              <button
                className="w-full overflow-hidden rounded-2xl cursor-zoom-in block"
                onClick={() => onOpenLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  draggable="false"
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ pointerEvents: 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </button>

              <button
                onClick={() => onToggleSelect(image.id)}
                className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'bg-forest-800 text-cream-50'
                    : 'bg-white/80 text-forest-700 opacity-0 group-hover:opacity-100'
                }`}
                aria-label={isSelected ? 'Ukloni iz odabranih' : 'Dodaj u odabrane'}
              >
                <HeartIcon filled={isSelected} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
