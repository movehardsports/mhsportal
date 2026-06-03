export function Tags({ items, color = 'zinc' }: { items: string[]; color?: 'zinc' | 'blue' }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={`rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs ${color === 'blue' ? 'text-blue-400' : 'text-zinc-300'}`}>
          {item}
        </span>
      ))}
    </div>
  )
}
