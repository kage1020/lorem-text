import { describe, expect, it } from "vitest"
import { getLiteratureText, getLoremText } from "./literatures"
import { MersenneTwister } from "./random"

describe("literature shuffling", () => {
  it("produces different first sentences across runs (no positional bias)", async () => {
    const firsts = new Set<string>()
    const mt = new MersenneTwister(4321)
    for (let i = 0; i < 50; i++) {
      const text = await getLoremText(() => mt.random())
      firsts.add(text.slice(0, 20))
    }
    expect(firsts.size).toBeGreaterThan(25)
  })

  it("literature endpoint does not return identical openings", async () => {
    const firsts = new Set<string>()
    const mt = new MersenneTwister(9999)
    for (let i = 0; i < 30; i++) {
      const text = await getLiteratureText("akutagawa", () => mt.random())
      firsts.add(text.slice(0, 20))
    }
    expect(firsts.size).toBeGreaterThan(15)
  })
})
