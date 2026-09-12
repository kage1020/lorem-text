import { URL_PORTS, URL_PROTOCOLS, URL_SUBDOMAINS, URL_TLDS } from "./const"
import lorem from "./data/lorem.json"

const SUBDOMAIN_RATE = 0.4
const PORT_RATE = 0.2
const QUERY_RATE = 0.5
const FRAGMENT_RATE = 0.3
const MAX_PATH_SEGMENTS = 3
const MAX_QUERY_PARAMS = 2

const WORDS = Array.from(
  new Set(
    Object.values(lorem)
      .join(" ")
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((word) => word.length >= 3 && word.length <= 12),
  ),
)

function choice<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]
}

function buildHost(random: () => number): string {
  const labels = [choice(WORDS, random), choice(URL_TLDS, random)]
  if (random() < SUBDOMAIN_RATE) {
    labels.unshift(choice(URL_SUBDOMAINS, random))
  }
  const host = labels.join(".")
  return random() < PORT_RATE ? `${host}:${choice(URL_PORTS, random)}` : host
}

function buildPath(random: () => number): string {
  const depth = Math.floor(random() * (MAX_PATH_SEGMENTS + 1))
  return Array.from({ length: depth }, () => `/${choice(WORDS, random)}`).join(
    "",
  )
}

function buildQuery(random: () => number): string {
  if (random() >= QUERY_RATE) return ""
  const count = 1 + Math.floor(random() * MAX_QUERY_PARAMS)
  const params = Array.from(
    { length: count },
    () => `${choice(WORDS, random)}=${choice(WORDS, random)}`,
  )
  return `?${params.join("&")}`
}

function buildFragment(random: () => number): string {
  return random() < FRAGMENT_RATE ? `#${choice(WORDS, random)}` : ""
}

export function generateUrl(random: () => number): string {
  const protocol = choice(URL_PROTOCOLS, random)
  return `${protocol}://${buildHost(random)}${buildPath(random)}${buildQuery(random)}${buildFragment(random)}`
}
