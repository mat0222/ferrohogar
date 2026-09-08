export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value * 2) / 2
  const gid = `star-half-${value}-${size}`
  return (
    <span className="inline-flex gap-px" aria-label={`${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rounded >= i + 1
        const half = !filled && rounded >= i + 0.5
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
            {half && (
              <defs>
                <linearGradient id={gid}>
                  <stop offset="50%" stopColor="#ff5a1f" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M12 3.2 14.7 9l6.3.7-4.7 4.3 1.3 6.3L12 17.2 6.4 20.3 7.7 14 3 9.7 9.3 9z"
              fill={filled ? '#ff5a1f' : half ? `url(#${gid})` : 'none'}
              stroke="#ff5a1f"
              strokeWidth="1.4"
            />
          </svg>
        )
      })}
    </span>
  )
}
