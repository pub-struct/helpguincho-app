export function formatDuration(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
  } else {
    return `${minutes}min`
  }
}
