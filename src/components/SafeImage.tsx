import { asset } from '../lib/asset'

const FALLBACK = '/img/tools.jpg'

type Props = {
  src: string
  alt: string
  className?: string
}

export function SafeImage({ src, alt, className }: Props) {
  return (
    <img
      src={asset(src)}
      alt={alt}
      className={className}
      onError={(e) => {
        const fallback = asset(FALLBACK)
        if (e.currentTarget.src.includes('tools.jpg')) return
        e.currentTarget.src = fallback
      }}
    />
  )
}
