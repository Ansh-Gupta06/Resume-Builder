import { TEMPLATE_IDS, type TemplateId } from '@/constants'

export type SortOrder = 'updatedAt-desc' | 'updatedAt-asc' | 'title-asc' | 'title-desc'

type FilterSortBarProps = {
  templateFilter: TemplateId | ''
  sortOrder: SortOrder
  onTemplateChange: (value: TemplateId | '') => void
  onSortChange: (value: SortOrder) => void
  totalVisible: number
  totalAll: number
}

export default function FilterSortBar({
  templateFilter,
  sortOrder,
  onTemplateChange,
  onSortChange,
  totalVisible,
  totalAll,
}: FilterSortBarProps) {
  const selectBase =
    'h-9 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 ' +
    'focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 ' +
    'cursor-pointer transition-colors duration-150 appearance-none pr-8'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <select
          id="filter-template"
          value={templateFilter}
          onChange={(e) => { onTemplateChange(e.target.value as TemplateId | '') }}
          className={selectBase}
          aria-label="Filter by template"
        >
          <option value="">All templates</option>
          {TEMPLATE_IDS.map((tpl) => (
            <option key={tpl} value={tpl} className="capitalize">
              {tpl.charAt(0).toUpperCase() + tpl.slice(1)}
            </option>
          ))}
        </select>
        <ChevronIcon />
      </div>

      <div className="relative">
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => { onSortChange(e.target.value as SortOrder) }}
          className={selectBase}
          aria-label="Sort resumes"
        >
          <option value="updatedAt-desc">Last updated</option>
          <option value="updatedAt-asc">Oldest first</option>
          <option value="title-asc">Name A → Z</option>
          <option value="title-desc">Name Z → A</option>
        </select>
        <ChevronIcon />
      </div>

      {(templateFilter || totalVisible !== totalAll) && (
        <span className="text-xs text-neutral-500 ml-auto">
          {totalVisible} of {totalAll}
        </span>
      )}
    </div>
  )
}

function ChevronIcon() {
  return (
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
      </svg>
    </span>
  )
}
