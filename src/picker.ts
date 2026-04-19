export type WeightedCharacters = { characters: string; ratio: number }

export function pick(
  length: number,
  characters: string | WeightedCharacters[],
  random: () => number,
): string {
  if (length <= 0) return ""

  if (typeof characters === "string") {
    if (characters.length === 0) return ""
    return Array.from(
      { length },
      () => characters[Math.floor(random() * characters.length)],
    ).join("")
  }

  const buckets = characters.filter(
    (c) => c.characters.length > 0 && c.ratio > 0,
  )
  if (buckets.length === 0) return ""
  const totalRatio = buckets.reduce((acc, c) => acc + c.ratio, 0)

  return Array.from({ length }, () => {
    const target = random() * totalRatio
    let cumulative = 0
    for (const bucket of buckets) {
      cumulative += bucket.ratio
      if (target < cumulative) {
        return bucket.characters[
          Math.floor(random() * bucket.characters.length)
        ]
      }
    }
    const last = buckets[buckets.length - 1]
    return last.characters[Math.floor(random() * last.characters.length)]
  }).join("")
}
