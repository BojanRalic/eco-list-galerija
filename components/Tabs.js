'use client'

export default function Tabs({ activeTab, onTabChange, selectedCount }) {
  const tabs = [
    { id: 'sve', label: 'Sve fotografije' },
    { id: 'odabrane', label: selectedCount > 0 ? `Odabrane (${selectedCount})` : 'Odabrane' },
  ]

  return (
    <div className="flex gap-1 p-1 bg-forest-900/10 rounded-full w-fit mx-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-forest-800 text-cream-50 shadow-sm'
              : 'text-forest-700 hover:text-forest-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
