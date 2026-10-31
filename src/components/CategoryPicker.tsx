import { useState } from 'react'
import { useStore } from '../store'

export default function CategoryPicker() {
  const { categories, activeCategory, setActiveCategory, addCategory, removeCategory } = useStore()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  function submit() {
    addCategory(name)
    setName('')
    setAdding(false)
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-white/60">Category</h2>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <span key={c} className="group relative">
            <button
              onClick={() => setActiveCategory(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                activeCategory === c
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {c}
            </button>
            {categories.length > 1 && (
              <button
                onClick={() => removeCategory(c)}
                aria-label={`Remove ${c}`}
                className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-xs text-white group-hover:flex"
              >
                ×
              </button>
            )}
          </span>
        ))}

        {adding ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
              if (e.key === 'Escape') setAdding(false)
            }}
            onBlur={submit}
            placeholder="New category"
            className="w-32 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white placeholder:text-white/40 outline-none"
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            + Add
          </button>
        )}
      </div>
    </section>
  )
}
