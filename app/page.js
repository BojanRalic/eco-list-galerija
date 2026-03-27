'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { images } from '@/lib/images'
import Tabs from '@/components/Tabs'
import Gallery from '@/components/Gallery'
import Lightbox from '@/components/Lightbox'

export default function Page() {
  const [activeTab, setActiveTab] = useState('sve')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    fetch('/api/selection')
      .then(r => r.json())
      .then(ids => setSelectedIds(new Set(ids)))
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setLightboxIndex(null)
  }

  const toggleSelect = useCallback(async (id) => {
    const action = selectedIds.has(id) ? 'remove' : 'add'
    setSelectedIds(prev => {
      const next = new Set(prev)
      action === 'add' ? next.add(id) : next.delete(id)
      return next
    })
    await fetch('/api/selection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
  }, [selectedIds])

  const visibleImages = activeTab === 'odabrane'
    ? images.filter(img => selectedIds.has(img.id))
    : images

  const total = visibleImages.length

  const handlePrev = useCallback(() => {
    setLightboxIndex(i => (i - 1 + total) % total)
  }, [total])

  const handleNext = useCallback(() => {
    setLightboxIndex(i => (i + 1) % total)
  }, [total])

  return (
    <main className="min-h-screen bg-cream-100">
      <section className="bg-forest-900 py-20 px-4 text-center">
        <p className="text-cream-100/50 text-xs tracking-[0.3em] uppercase mb-3">Bio List</p>
        <h1
          className="text-cream-50 text-5xl sm:text-6xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Galerija
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-cream-100/25" />
          <p className="text-cream-100/50 text-sm tracking-wider">Odaberite vaše fotografije</p>
          <div className="h-px w-12 bg-cream-100/25" />
        </div>
      </section>

      <section className="py-10 px-4">
        <Tabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedCount={selectedIds.size}
        />
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {activeTab === 'odabrane' && visibleImages.length === 0 ? (
          <p className="text-center text-forest-700/50 py-20 text-sm">
            Još niste odabrali nijednu fotografiju.
          </p>
        ) : (
          <Gallery
            images={visibleImages}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onOpenLightbox={setLightboxIndex}
          />
        )}
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            images={visibleImages}
            onClose={() => setLightboxIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
