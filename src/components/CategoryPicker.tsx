import { useState } from 'react'
import { useStore } from '../context'
import { useMessages } from '../i18n/react'

export default function CategoryPicker() {
  const { categories, activeCategory, setActiveCategory, addCategory, removeCategory } = useStore()
  const t = useMessages()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  function submit() {
    addCategory(name)
    setName('')
    setAdding(false)
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-bold">{t.category}</h2>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <span key={c} className="group relative">
            <button
              onClick={() => setActiveCategory(c)}
              aria-pressed={activeCategory === c}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                activeCategory === c ? 'bg-primary text-on-primary' : 'bg-soft text-ink'
              }`}
            >
              {t.defaultCategories[c] ?? c}
            </button>
            {categories.length > 1 && (
              <button
                onClick={() => removeCategory(c)}
                aria-label={t.removeCategory(t.defaultCategories[c] ?? c)}
                className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full border border-line bg-paper text-xs text-muted group-hover:flex [@media(hover:none)]:flex"
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
            placeholder={t.newCategory}
            className="w-36 rounded-full bg-soft px-3 py-1.5 text-sm outline-none placeholder:text-muted"
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="rounded-full border border-dashed border-line px-3 py-1.5 text-sm text-muted transition hover:text-ink"
          >
            + {t.addCategory}
          </button>
        )}
      </div>
    </section>
  )
}
