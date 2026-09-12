import { describe, expect, it } from "vitest"
import { URL_PORTS, URL_TLDS } from "./const"
import { MersenneTwister } from "./random"
import { generateUrl } from "./url"

const HOSTNAME_PATTERN = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/
const TOKEN_PATTERN = /^[a-z0-9-]+$/

function generateMany(seed: number, count: number): URL[] {
  const mt = new MersenneTwister(seed)
  return Array.from(
    { length: count },
    () => new URL(generateUrl(() => mt.random())),
  )
}

describe("generateUrl", () => {
  it("returns a parsable URL", () => {
    const mt = new MersenneTwister(1)
    expect(() => new URL(generateUrl(() => mt.random()))).not.toThrow()
  })

  it("always uses https", () => {
    for (const url of generateMany(2, 50)) {
      expect(url.protocol).toBe("https:")
    }
  })

  it("builds a hostname of dot separated labels", () => {
    for (const url of generateMany(3, 50)) {
      expect(url.hostname).toMatch(HOSTNAME_PATTERN)
    }
  })

  it("ends the hostname with a known TLD", () => {
    for (const url of generateMany(4, 50)) {
      expect(URL_TLDS.some((tld) => url.hostname.endsWith(`.${tld}`))).toBe(
        true,
      )
    }
  })

  it("builds path segments from safe tokens", () => {
    for (const url of generateMany(5, 50)) {
      for (const segment of url.pathname.split("/").filter(Boolean)) {
        expect(segment).toMatch(TOKEN_PATTERN)
      }
    }
  })

  it("builds query keys and values from safe tokens", () => {
    for (const url of generateMany(6, 50)) {
      for (const [key, value] of url.searchParams) {
        expect(key).toMatch(TOKEN_PATTERN)
        expect(value).toMatch(TOKEN_PATTERN)
      }
    }
  })

  it("builds a fragment from a safe token", () => {
    for (const url of generateMany(7, 50)) {
      if (url.hash) expect(url.hash.slice(1)).toMatch(TOKEN_PATTERN)
    }
  })

  it("uses a known port when one is present", () => {
    for (const url of generateMany(8, 100)) {
      if (url.port) expect(URL_PORTS).toContain(Number(url.port))
    }
  })

  it("is deterministic for a given seed", () => {
    const a = new MersenneTwister(2026)
    const b = new MersenneTwister(2026)
    expect(generateUrl(() => a.random())).toBe(generateUrl(() => b.random()))
  })

  it("yields different urls for different seeds", () => {
    const a = new MersenneTwister(1)
    const b = new MersenneTwister(2)
    expect(generateUrl(() => a.random())).not.toBe(
      generateUrl(() => b.random()),
    )
  })

  it("varies the presence of optional components", () => {
    const urls = generateMany(9, 100)
    const withQuery = urls.filter((url) => url.search !== "")
    const withFragment = urls.filter((url) => url.hash !== "")
    const withSubdomain = urls.filter(
      (url) => url.hostname.split(".").length > 2,
    )

    expect(withQuery.length).toBeGreaterThan(0)
    expect(withQuery.length).toBeLessThan(urls.length)
    expect(withFragment.length).toBeGreaterThan(0)
    expect(withFragment.length).toBeLessThan(urls.length)
    expect(withSubdomain.length).toBeGreaterThan(0)
    expect(withSubdomain.length).toBeLessThan(urls.length)
  })
})
