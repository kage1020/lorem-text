import { describe, expect, it } from "vitest"
import app from "./index"
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

describe("url endpoints", () => {
  it("returns a single url as plain text", async () => {
    const res = await app.request("/url")
    expect(res.status).toBe(200)
    const text = await res.text()
    expect(() => new URL(text)).not.toThrow()
  })

  it("returns the requested number of urls as json", async () => {
    const res = await app.request("/url/3")
    expect(res.status).toBe(200)
    const urls = (await res.json()) as string[]
    expect(urls).toHaveLength(3)
    for (const url of urls) expect(() => new URL(url)).not.toThrow()
  })

  it("falls back to the default count for a non numeric count", async () => {
    const res = await app.request("/url/abc")
    const urls = (await res.json()) as string[]
    expect(urls).toHaveLength(100)
  })

  it("is not shadowed by the literature catch-all route", async () => {
    const res = await app.request("/url/5")
    expect(res.headers.get("content-type")).toContain("application/json")
  })

  it("is listed on the index route", async () => {
    const res = await app.request("/")
    const routes = (await res.json()) as Record<string, string>
    expect(routes.url).toBe("/url")
    expect(routes.urls).toBe("/url/:count")
  })
})

describe("base64 endpoints", () => {
  const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/
  const BASE64URL_PATTERN = /^[A-Za-z0-9_-]*$/

  it("returns standard base64 encoding the requested number of bytes", async () => {
    const res = await app.request("/base64/16")
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("text/plain")
    const text = await res.text()
    expect(text).toMatch(BASE64_PATTERN)
    expect(text).toHaveLength(24)
    expect(Buffer.from(text, "base64")).toHaveLength(16)
  })

  it("pads standard base64 when the byte count is not a multiple of 3", async () => {
    const res = await app.request("/base64/1")
    const text = await res.text()
    expect(text).toMatch(/^[A-Za-z0-9+/]{2}==$/)
  })

  it("returns unpadded url-safe base64 encoding the requested number of bytes", async () => {
    const res = await app.request("/base64url/16")
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("text/plain")
    const text = await res.text()
    expect(text).toMatch(BASE64URL_PATTERN)
    expect(text).toHaveLength(22)
    expect(Buffer.from(text, "base64url")).toHaveLength(16)
  })

  it("falls back to 32 bytes for a non numeric length", async () => {
    const standard = await (await app.request("/base64/abc")).text()
    const urlSafe = await (await app.request("/base64url/abc")).text()
    expect(Buffer.from(standard, "base64")).toHaveLength(32)
    expect(Buffer.from(urlSafe, "base64url")).toHaveLength(32)
  })

  it("returns different values on each request", async () => {
    const a = await (await app.request("/base64/32")).text()
    const b = await (await app.request("/base64/32")).text()
    expect(a).not.toBe(b)
  })

  it("is listed on the index route", async () => {
    const res = await app.request("/")
    const routes = (await res.json()) as Record<string, string>
    expect(routes.base64).toBe("/base64/:length")
    expect(routes.base64url).toBe("/base64url/:length")
  })
})
