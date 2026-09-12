import { randomBytes } from "node:crypto"
import { createId as cuid2 } from "@paralleldrive/cuid2"
import cuid from "cuid"
import { Hono } from "hono"
import { ulid } from "ulid"
import { v4, v7 } from "uuid"
import {
  ALPHABET_LOWER,
  ALPHABET_UPPER,
  HIRAGANA,
  KANJI1,
  KANJI2,
  KATAKANA,
  NUMBER,
  SYMBOL,
} from "./const"
import { getLiteratureText, getLoremText } from "./literatures"
import { getFirstNames, getLastNames } from "./person"
import { pick } from "./picker"
import { createRandom } from "./random"
import { generateUrl } from "./url"

let cachedRandom: (() => number) | null = null
const random: () => number = () => {
  if (!cachedRandom) cachedRandom = createRandom()
  return cachedRandom()
}

const app = new Hono()

app.get("/", (c) => {
  return c.json({
    cuid: "/cuid",
    cuid2: "/cuid2",
    uuidV4: "/uuidv4",
    uuidV7: "/uuidv7",
    ulid: "/ulid",
    hex: "/hex/:length",
    number: "/number/:length",
    alphabet: "/alphabet/:length",
    alphaUpper: "/alphaUpper/:length",
    alphaLower: "/alphaLower/:length",
    alphaNumeric: "/alphaNumeric/:length",
    alphaNumericUpper: "/alphaNumericUpper/:length",
    alphaNumericLower: "/alphaNumericLower/:length",
    symbol: "/symbol/:length",
    alphaNumericSymbol: "/alphaNumericSymbol/:length",
    alphaNumericSymbolUpper: "/alphaNumericSymbolUpper/:length",
    alphaNumericSymbolLower: "/alphaNumericSymbolLower/:length",
    hiragana: "/hiragana/:length",
    katakana: "/katakana/:length",
    kanji: "/kanji/:length",
    kanji2: "/kanji2/:length",
    japanese: "/japanese/:length",
    lorem: "/lorem/:length",
    url: "/url",
    urls: "/url/:count",
    "person-keys": "/person",
    person: "/person/:keys/:length",
    "author-keys": "/author",
    author: "/:author/:length",
    rsaJwk: "/rsa/jwk",
    rsaPem: "/rsa/pem",
  })
})

app.get("/cuid", (c) => {
  return c.text(cuid())
})

app.get("/cuid2", (c) => {
  return c.text(cuid2())
})

app.get("/uuidv4", (c) => {
  return c.text(v4())
})

app.get("/uuidv7", (c) => {
  return c.text(v7())
})

app.get("/ulid", (c) => {
  return c.text(ulid())
})

app.get("/hex/:length", async (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  const randomHex = randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length)
  return c.text(randomHex)
})

app.get("/number/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, NUMBER, random))
})

app.get("/alphabet/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_UPPER + ALPHABET_LOWER, random))
})

app.get("/alphaUpper/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_UPPER, random))
})

app.get("/alphaLower/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_LOWER, random))
})

app.get("/alphaNumeric/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_UPPER + ALPHABET_LOWER + NUMBER, random))
})

app.get("/alphaNumericUpper/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_UPPER + NUMBER, random))
})

app.get("/alphaNumericLower/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_LOWER + NUMBER, random))
})

app.get("/symbol/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, SYMBOL, random))
})

app.get("/alphaNumericSymbol/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(
    pick(length, ALPHABET_UPPER + ALPHABET_LOWER + NUMBER + SYMBOL, random),
  )
})

app.get("/alphaNumericSymbolUpper/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_UPPER + NUMBER + SYMBOL, random))
})

app.get("/alphaNumericSymbolLower/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 32
  return c.text(pick(length, ALPHABET_LOWER + NUMBER + SYMBOL, random))
})

app.get("/hiragana/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 100
  return c.text(pick(length, HIRAGANA, random))
})

app.get("/katakana/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 100
  return c.text(pick(length, KATAKANA, random))
})

app.get("/kanji/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 100
  return c.text(pick(length, KANJI1, random))
})

app.get("/kanji2/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 100
  return c.text(pick(length, KANJI2, random))
})

app.get("/japanese/:length", (c) => {
  const length = parseInt(c.req.param("length"), 10) || 100
  return c.text(
    pick(
      length,
      [
        { characters: HIRAGANA, ratio: 0.3 },
        { characters: KATAKANA, ratio: 0.3 },
        { characters: KANJI1, ratio: 0.4 },
      ],
      random,
    ),
  )
})

app.get("/lorem/:length", async (c) => {
  const length = parseInt(c.req.param("length"), 10) || 100
  const text = await getLoremText(random)
  return c.text(text.slice(0, length))
})

app.get("/url", (c) => {
  return c.text(generateUrl(random))
})

app.get("/url/:count", (c) => {
  const count = parseInt(c.req.param("count"), 10) || 100
  return c.json(Array.from({ length: count }, () => generateUrl(random)))
})

app.get("/rsa/jwk", async (c) => {
  const keyPair = (await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]).buffer,
      hash: "SHA-512",
    },
    true,
    ["encrypt", "decrypt"],
  )) as CryptoKeyPair
  const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey)
  const privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey)
  return c.json({ publicKey, privateKey })
})

app.get("/rsa/pem", async (c) => {
  const keyPair = (await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]).buffer,
      hash: "SHA-512",
    },
    true,
    ["encrypt", "decrypt"],
  )) as CryptoKeyPair
  const publicKeyBuffer = (await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey,
  )) as ArrayBuffer
  const publicKey = `-----BEGIN PUBLIC KEY-----
${btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))}
-----END PUBLIC KEY-----`
  const privateKeyBuffer = (await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey,
  )) as ArrayBuffer
  const privateKey = `-----BEGIN PRIVATE KEY-----
${btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))}
-----END PRIVATE KEY-----`
  return c.json({ publicKey, privateKey })
})

app.get("/person", (c) => {
  return c.json({
    keys: ["first", "last"],
  })
})

app.get("/person/:keys/:length", (c) => {
  const keys = c.req.param("keys").split(",")
  const length = parseInt(c.req.param("length"), 10) || 100
  const firstNames = getFirstNames()
  const lastNames = getLastNames()
  const person = Array.from({ length }, () => {
    const data: Record<string, string> = {}
    keys.forEach((key) => {
      if (key === "first") {
        data[key] = firstNames[Math.floor(random() * firstNames.length)]
      } else if (key === "last") {
        data[key] = lastNames[Math.floor(random() * lastNames.length)]
      }
    })
    return data
  })
  return c.json(person)
})

app.get("/author", (c) => {
  return c.json({
    authors: ["akutagawa", "dazai", "edogawa", "natsume"],
  })
})

app.get("/:author/:length", async (c) => {
  const length = parseInt(c.req.param("length"), 10) || 100
  const author = c.req.param("author")
  const text = await getLiteratureText(author, random)
  return c.text(text.slice(0, length))
})

export default app
