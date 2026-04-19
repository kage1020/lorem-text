import { describe, expect, it } from "vitest"
import { getLiteratureText, getLoremText } from "./literatures"
import { MersenneTwister } from "./random"
import { shuffle } from "./shuffle"

describe("shuffle on a small fixture", () => {
  it("is deterministic for a given seed", () => {
    const fixture = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const mt1 = new MersenneTwister(2026)
    const mt2 = new MersenneTwister(2026)
    const a = shuffle(fixture, () => mt1.random())
    const b = shuffle(fixture, () => mt2.random())
    expect(a).toEqual(b)
    expect(a).not.toEqual(fixture)
  })
})

describe("literature shuffling", () => {
  it("is deterministic for the same seed", async () => {
    const mt1 = new MersenneTwister(123)
    const mt2 = new MersenneTwister(123)
    const a = await getLoremText(() => mt1.random())
    const b = await getLoremText(() => mt2.random())
    expect(a).toEqual(b)
  })

  it("yields different outputs for different seeds", async () => {
    const a = await getLoremText(() => new MersenneTwister(1).random())
    const b = await getLoremText(() => new MersenneTwister(2).random())
    expect(a).not.toEqual(b)
  })

  it("produces varied first sentences across runs (no positional bias)", async () => {
    const firsts = new Set<string>()
    const mt = new MersenneTwister(4321)
    for (let i = 0; i < 30; i++) {
      const text = await getLoremText(() => mt.random())
      firsts.add(text.slice(0, 20))
    }
    expect(firsts.size).toBeGreaterThan(firsts.size / 2)
    expect(firsts.size).toBeGreaterThan(10)
  })

  it("literature endpoint does not return identical openings", async () => {
    const firsts = new Set<string>()
    const mt = new MersenneTwister(9999)
    for (let i = 0; i < 20; i++) {
      const text = await getLiteratureText("akutagawa", () => mt.random())
      firsts.add(text.slice(0, 20))
    }
    expect(firsts.size).toBeGreaterThan(10)
  })
})
