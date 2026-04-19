import { describe, expect, it } from "vitest"
import { createRandom, MersenneTwister } from "./random"

describe("MersenneTwister", () => {
  it("is reproducible with the same seed", () => {
    const a = new MersenneTwister(1)
    const b = new MersenneTwister(1)
    for (let i = 0; i < 1000; i++) {
      expect(a.random()).toBe(b.random())
    }
  })

  it("produces different sequences for different seeds", () => {
    const a = new MersenneTwister(1)
    const b = new MersenneTwister(2)
    const seqA = Array.from({ length: 16 }, () => a.random())
    const seqB = Array.from({ length: 16 }, () => b.random())
    expect(seqA).not.toEqual(seqB)
  })

  it("random() returns values in [0, 1)", () => {
    const mt = new MersenneTwister(7)
    for (let i = 0; i < 10000; i++) {
      const v = mt.random()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it("is roughly uniform over [0, 1)", () => {
    const mt = new MersenneTwister(13)
    const buckets = new Array(10).fill(0)
    const trials = 100000
    for (let i = 0; i < trials; i++) {
      const v = mt.random()
      buckets[Math.floor(v * 10)]++
    }
    const expected = trials / 10
    const tolerance = expected * 0.03
    for (const count of buckets) {
      expect(Math.abs(count - expected)).toBeLessThan(tolerance)
    }
  })
})

describe("createRandom", () => {
  it("returns a function yielding values in [0, 1)", () => {
    const rng = createRandom()
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it("independent calls yield independent streams", () => {
    const r1 = createRandom()
    const r2 = createRandom()
    const seqA = Array.from({ length: 32 }, () => r1())
    const seqB = Array.from({ length: 32 }, () => r2())
    expect(seqA).not.toEqual(seqB)
  })
})
