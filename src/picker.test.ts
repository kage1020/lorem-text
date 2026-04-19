import { describe, expect, it } from "vitest"
import { pick } from "./picker"
import { MersenneTwister } from "./random"

describe("pick", () => {
  it("returns a string of exactly the requested length", () => {
    const mt = new MersenneTwister(1)
    const result = pick(32, "abcdef", () => mt.random())
    expect(result).toHaveLength(32)
  })

  it("only contains characters from the pool", () => {
    const mt = new MersenneTwister(2)
    const pool = "XYZ"
    const result = pick(100, pool, () => mt.random())
    for (const ch of result) {
      expect(pool).toContain(ch)
    }
  })

  it("handles length = 0", () => {
    expect(pick(0, "abc", Math.random)).toBe("")
    expect(pick(0, [{ characters: "abc", ratio: 1 }], Math.random)).toBe("")
  })

  it("respects the ratio distribution within tolerance", () => {
    const mt = new MersenneTwister(42)
    const result = pick(
      10000,
      [
        { characters: "A", ratio: 0.3 },
        { characters: "B", ratio: 0.3 },
        { characters: "C", ratio: 0.4 },
      ],
      () => mt.random(),
    )
    expect(result).toHaveLength(10000)
    const counts = { A: 0, B: 0, C: 0 }
    for (const ch of result) counts[ch as "A" | "B" | "C"]++
    expect(Math.abs(counts.A - 3000)).toBeLessThan(100)
    expect(Math.abs(counts.B - 3000)).toBeLessThan(100)
    expect(Math.abs(counts.C - 4000)).toBeLessThan(100)
  })

  it("preserves ratios even when length * ratio has fractional parts", () => {
    const mt = new MersenneTwister(7)
    const trials = 5000
    let countA = 0
    let countB = 0
    for (let i = 0; i < trials; i++) {
      const result = pick(
        7,
        [
          { characters: "A", ratio: 0.5 },
          { characters: "B", ratio: 0.5 },
        ],
        () => mt.random(),
      )
      expect(result).toHaveLength(7)
      for (const ch of result) {
        if (ch === "A") countA++
        else countB++
      }
    }
    const total = trials * 7
    const tolerance = total * 0.02
    expect(Math.abs(countA - total / 2)).toBeLessThan(tolerance)
    expect(Math.abs(countB - total / 2)).toBeLessThan(tolerance)
  })

  it("shuffles placements (ratio-mode is not block-sorted)", () => {
    const mt = new MersenneTwister(55)
    let firstA = 0
    const trials = 2000
    for (let i = 0; i < trials; i++) {
      const result = pick(
        10,
        [
          { characters: "A", ratio: 0.5 },
          { characters: "B", ratio: 0.5 },
        ],
        () => mt.random(),
      )
      if (result[0] === "A") firstA++
    }
    const rate = firstA / trials
    expect(Math.abs(rate - 0.5)).toBeLessThan(0.05)
  })
})
