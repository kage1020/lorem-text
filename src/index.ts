import { randomBytes } from 'node:crypto';
import { Hono } from 'hono';
import cuid from 'cuid';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { v4, v7 } from 'uuid';
import { ulid } from 'ulid';
import {
  ALPHABET_LOWER,
  ALPHABET_UPPER,
  HIRAGANA,
  KANJI1,
  KANJI2,
  KATAKANA,
  NUMBER,
  SYMBOL,
} from './const';
import { getLiteratureText, getLoremText } from './literatures';
import { MersenneTwister } from './random';

const mt = new MersenneTwister(new Date().getTime());

function picker(
  length: number,
  characters: string | { characters: string; ratio: number }[]
): string {
  if (typeof characters === 'string') {
    return Array.from(
      { length },
      () => characters[Math.floor(mt.random() * characters.length)]
    ).join('');
  }
  const pickedCharacters = Object.values(characters)
    .reduce(
      (acc, cur) =>
        acc +
        Array.from(
          { length: Math.floor(cur.ratio * length) },
          () => cur.characters[Math.floor(mt.random() * cur.characters.length)]
        ).join(''),
      ''
    )
    .split('')
    .sort(() => mt.random() - 0.5)
    .join('');
  if (pickedCharacters.length < length) {
    return (
      pickedCharacters +
      picker(
        length - pickedCharacters.length,
        characters.reduce((acc, cur) => acc + cur.characters, '')
      )
    );
  } else {
    return pickedCharacters;
  }
}

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    cuid: '/cuid',
    cuid2: '/cuid2',
    uuidV4: '/uuidv4',
    uuidV7: '/uuidv7',
    ulid: '/ulid',
    hex: '/hex/:length',
    number: '/number/:length',
    alphabet: '/alphabet/:length',
    alphaUpper: '/alphaUpper/:length',
    alphaLower: '/alphaLower/:length',
    alphaNumeric: '/alphaNumeric/:length',
    alphaNumericUpper: '/alphaNumericUpper/:length',
    alphaNumericLower: '/alphaNumericLower/:length',
    symbol: '/symbol/:length',
    alphaNumericSymbol: '/alphaNumericSymbol/:length',
    alphaNumericSymbolUpper: '/alphaNumericSymbolUpper/:length',
    alphaNumericSymbolLower: '/alphaNumericSymbolLower/:length',
    hiragana: '/hiragana/:length',
    katakana: '/katakana/:length',
    kanji: '/kanji/:length',
    kanji2: '/kanji2/:length',
    japanese: '/japanese/:length',
    lorem: '/lorem/:length',
    author: '/:author/:length',
    rsaJwk: '/rsa/jwk',
    rsaPem: '/rsa/pem',
  });
});

app.get('/cuid', (c) => {
  return c.text(cuid());
});

app.get('/cuid2', (c) => {
  return c.text(cuid2());
});

app.get('/uuidv4', (c) => {
  return c.text(v4());
});

app.get('/uuidv7', (c) => {
  return c.text(v7());
});

app.get('/ulid', (c) => {
  return c.text(ulid());
});

app.get('/hex/:length', async (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomHex = randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
  return c.text(randomHex);
});

app.get('/number/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomNumber = picker(length, NUMBER);
  return c.text(randomNumber);
});

app.get('/alphabet/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphabet = picker(length, ALPHABET_UPPER + ALPHABET_LOWER);
  return c.text(randomAlphabet);
});

app.get('/alphaUpper/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphaUpper = picker(length, ALPHABET_UPPER);
  return c.text(randomAlphaUpper);
});

app.get('/alphaLower/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphaLower = picker(length, ALPHABET_LOWER);
  return c.text(randomAlphaLower);
});

app.get('/alphaNumeric/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphaNumeric = picker(length, ALPHABET_UPPER + ALPHABET_LOWER + NUMBER);
  return c.text(randomAlphaNumeric);
});

app.get('/alphaNumericUpper/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphanumericUpper = picker(length, ALPHABET_UPPER + NUMBER);
  return c.text(randomAlphanumericUpper);
});

app.get('/alphaNumericLower/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphaNumericLower = picker(length, ALPHABET_LOWER + NUMBER);
  return c.text(randomAlphaNumericLower);
});

app.get('/symbol/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomSymbol = picker(length, SYMBOL);
  return c.text(randomSymbol);
});

app.get('/alphaNumericSymbol/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphaNumericSymbol = picker(
    length,
    ALPHABET_UPPER + ALPHABET_LOWER + NUMBER + SYMBOL
  );
  return c.text(randomAlphaNumericSymbol);
});

app.get('/alphaNumericSymbolUpper/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphaNumericSymbolUpper = picker(length, ALPHABET_UPPER + NUMBER + SYMBOL);
  return c.text(randomAlphaNumericSymbolUpper);
});

app.get('/alphaNumericSymbolLower/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 32;
  const randomAlphaNumericSymbolLower = picker(length, ALPHABET_LOWER + NUMBER + SYMBOL);
  return c.text(randomAlphaNumericSymbolLower);
});

app.get('/hiragana/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 100;
  const randomHiragana = picker(length, HIRAGANA);
  return c.text(randomHiragana);
});

app.get('/katakana/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 100;
  const randomKatakana = picker(length, KATAKANA);
  return c.text(randomKatakana);
});

app.get('/kanji/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 100;
  const randomKanji = picker(length, KANJI1);
  return c.text(randomKanji);
});

app.get('/kanji2/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 100;
  const randomKanji = picker(length, KANJI2);
  return c.text(randomKanji);
});

app.get('/japanese/:length', (c) => {
  const length = parseInt(c.req.param('length')) || 100;
  const randomJapanese = picker(length, [
    { characters: HIRAGANA, ratio: 0.3 },
    { characters: KATAKANA, ratio: 0.3 },
    { characters: KANJI1, ratio: 0.4 },
  ]);
  return c.text(randomJapanese);
});

app.get('/lorem/:length', async (c) => {
  const length = parseInt(c.req.param('length')) || 100;
  const text = await getLoremText(mt.random);
  return c.text(text.slice(0, length));
});

app.get('/rsa/jwk', async (c) => {
  const keyPair = (await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]).buffer,
      hash: 'SHA-512',
    },
    true,
    ['encrypt', 'decrypt']
  )) as CryptoKeyPair;
  const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
  return c.json({ publicKey, privateKey });
});

app.get('/rsa/pem', async (c) => {
  const keyPair = (await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]).buffer,
      hash: 'SHA-512',
    },
    true,
    ['encrypt', 'decrypt']
  )) as CryptoKeyPair;
  const publicKeyBuffer = (await crypto.subtle.exportKey('spki', keyPair.publicKey)) as ArrayBuffer;
  const publicKey = `-----BEGIN PUBLIC KEY-----
${btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))}
-----END PUBLIC KEY-----`;
  const privateKeyBuffer = (await crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  )) as ArrayBuffer;
  const privateKey = `-----BEGIN PRIVATE KEY-----
${btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))}
-----END PRIVATE KEY-----`;
  return c.json({ publicKey, privateKey });
});

app.get('/:author/:length', async (c) => {
  const length = parseInt(c.req.param('length')) || 100;
  const author = c.req.param('author');
  const text = await getLiteratureText(author, mt.random);
  return c.text(text.slice(0, length));
});

export default app;
