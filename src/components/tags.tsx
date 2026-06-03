type TagGroup = { items: string[]; color?: 'zinc' | 'blue' }

export function Tags({ groups }: { groups: TagGroup[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {groups.flatMap(({ items, color = 'zinc' }) =>
        items.map((item) => (
          <span
            key={item}
            className={`rounded-md border px-2 py-0.5 text-xs ${
              color === 'blue' ? 'border-zinc-800 text-blue-500' : 'border-zinc-800 text-zinc-500'
            } group-hover:border-zinc-700`}
          >
            {item}
          </span>
        ))
      )}
    </div>
  )
}
