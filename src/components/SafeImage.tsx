const FALLBACK = '/img/tools.jpg'

type Props = {
  src: string
  alt: string
  className?: string
}

export function SafeImage({ src, alt, className }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src.endsWith(FALLBACK)) return
        e.currentTarget.src = FALLBACK
      }}
    />
  )
}
