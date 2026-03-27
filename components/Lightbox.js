'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function HeartIcon({ filled }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

export default function Lightbox({ index, images, onClose, onPrev, onNext, selectedIds, onToggleSelect }) {
  const image = images[index]
  const touchStart = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onNext, onPrev, onClose])

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? onNext() : onPrev()
    touchStart.current = null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onContextMenu={e => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSelect(image.id) }}
        className={`absolute top-4 left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
          selectedIds.has(image.id)
            ? 'bg-forest-800 text-cream-50'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
        aria-label={selectedIds.has(image.id) ? 'Ukloni iz odabranih' : 'Dodaj u odabrane'}
      >
        <HeartIcon filled={selectedIds.has(image.id)} />
      </button>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
        aria-label="Zatvori"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
        aria-label="Prethodna"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200"
        aria-label="Sledeća"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={image.src}
            alt={image.alt}
            draggable="false"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            style={{ pointerEvents: 'none' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-white/80 text-sm font-medium">{image.alt}</p>
        <p className="text-white/40 text-xs mt-1">{index + 1} / {images.length}</p>
      </div>
    </motion.div>
  )
}
