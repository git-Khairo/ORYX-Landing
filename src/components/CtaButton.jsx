export default function CtaButton({ children, href, onClick, variant = 'solid', ...rest }) {
  const cls = `cta cta-${variant}`
  if (href) {
    return (
      <a className={cls} href={href} {...rest}>
        <span>{children}</span>
        <Arrow />
      </a>
    )
  }
  return (
    <button className={cls} onClick={onClick} {...rest}>
      <span>{children}</span>
      <Arrow />
    </button>
  )
}

function Arrow() {
  return (
    <svg className="cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
