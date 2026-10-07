

export function SkeletonCard() {
  return (
    <div className="card skeleton-card" aria-hidden="true">
      <div className="skeleton-block skeleton-media" />
      <div className="skeleton-body">
        <div className="skeleton-block skeleton-line skeleton-line-lg" />
        <div className="skeleton-block skeleton-line" />
        <div className="skeleton-block skeleton-line skeleton-line-short" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="event-grid" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="state-panel" role="alert">
      <div className="state-panel-icon" aria-hidden="true">
        !
      </div>
      <h3>{title}</h3>
      {message && <p className="text-muted">{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', message }) {
  return (
    <div className="state-panel">
      <h3>{title}</h3>
      {message && <p className="text-muted">{message}</p>}
    </div>
  )
}