import { describe, expect, it } from "vitest"
import { MersenneTwister } from "./random"
import { shuffle } from "./shuffle"

describe("shuffle", () => {
  it("returns a new array with the same elements", () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input, Math.random)
    expect(result).toHaveLength(input.length)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it("does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5]
    const snapshot = [...input]
    shuffle(input, Math.random)
    expect(input).toEqual(snapshot)
  })

  it("is deterministic with a seeded rng", () => {
    const mt1 = new MersenneTwister(42)
    const mt2 = new MersenneTwister(42)
    const a = shuffle([1, 2, 3, 4, 5, 6, 7, 8], () => mt1.random())
    const b = shuffle([1, 2, 3, 4, 5, 6, 7, 8], () => mt2.random())
    expect(a).toEqual(b)
  })

  it("produces approximately uniform permutations", () => {
    const mt = new MersenneTwister(12345)
    const counts = new Map<string, number>()
    const trials = 60000
    for (let i = 0; i < trials; i++) {
      const key = shuffle([0, 1, 2], () => mt.random()).join("")
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    const expected = trials / 6
    const tolerance = expected * 0.05
    expect(counts.size).toBe(6)
    for (const count of counts.values()) {
      expect(Math.abs(count - expected)).toBeLessThan(tolerance)
    }
  })

  it("does not preserve first-element position bias", () => {
    const mt = new MersenneTwister(98765)
    const trials = 20000
    const size = 10
    const base = Array.from({ length: size }, (_, i) => i)
    let firstStaysAtZero = 0
    for (let i = 0; i < trials; i++) {
      const result = shuffle(base, () => mt.random())
      if (result[0] === 0) firstStaysAtZero++
    }
    const rate = firstStaysAtZero / trials
    const expected = 1 / size
    expect(Math.abs(rate - expected)).toBeLessThan(0.02)
  })
})
