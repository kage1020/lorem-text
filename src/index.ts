import { Hono } from 'hono';
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

function picker(
  length: number,
  characters: string | { characters: string; ratio: number }[]
): string {
  if (typeof characters === 'string') {
    return Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join('');
  }
  const pickedCharacters = Object.values(characters)
    .reduce(
      (acc, cur) =>
        acc +
        Array.from(
          { length: Math.floor(cur.ratio * length) },
          () => cur.characters[Math.floor(Math.random() * cur.characters.length)]
        ).join(''),
      ''
    )
    .split('')
    .sort(() => Math.random() - 0.5)
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

app.get('/number/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomNumber = picker(length, NUMBER);
  return c.text(randomNumber);
});

app.get('/alphabet/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphabet = picker(length, ALPHABET_UPPER + ALPHABET_LOWER);
  return c.text(randomAlphabet);
});

app.get('/alphaUpper/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaUpper = picker(length, ALPHABET_UPPER);
  return c.text(randomAlphaUpper);
});

app.get('/alphaLower/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaLower = picker(length, ALPHABET_LOWER);
  return c.text(randomAlphaLower);
});

app.get('/alphaNumeric/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumeric = picker(length, ALPHABET_UPPER + ALPHABET_LOWER + NUMBER);
  return c.text(randomAlphaNumeric);
});

app.get('/alphaNumericUpper/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphanumericUpper = picker(length, ALPHABET_UPPER + NUMBER);
  return c.text(randomAlphanumericUpper);
});

app.get('/alphaNumericLower/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericLower = picker(length, ALPHABET_LOWER + NUMBER);
  return c.text(randomAlphaNumericLower);
});

app.get('/symbol/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomSymbol = picker(length, SYMBOL);
  return c.text(randomSymbol);
});

app.get('/alphaNumericSymbol/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericSymbol = picker(
    length,
    ALPHABET_UPPER + ALPHABET_LOWER + NUMBER + SYMBOL
  );
  return c.text(randomAlphaNumericSymbol);
});

app.get('/alphaNumericSymbolUpper/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericSymbolUpper = picker(length, ALPHABET_UPPER + NUMBER + SYMBOL);
  return c.text(randomAlphaNumericSymbolUpper);
});

app.get('/alphaNumericSymbolLower/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericSymbolLower = picker(length, ALPHABET_LOWER + NUMBER + SYMBOL);
  return c.text(randomAlphaNumericSymbolLower);
});

app.get('/hiragana/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomHiragana = picker(length, HIRAGANA);
  return c.text(randomHiragana);
});

app.get('/katakana/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomKatakana = picker(length, KATAKANA);
  return c.text(randomKatakana);
});

app.get('/kanji/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomKanji = picker(length, KANJI1);
  return c.text(randomKanji);
});

app.get('/kanji2/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomKanji = picker(length, KANJI2);
  return c.text(randomKanji);
});

app.get('/japanese/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomJapanese = picker(length, [
    { characters: HIRAGANA, ratio: 0.3 },
    { characters: KATAKANA, ratio: 0.3 },
    { characters: KANJI1, ratio: 0.4 },
  ]);
  return c.text(randomJapanese);
});

app.get('/lorem/:length', async (c) => {
  const length = parseInt(c.req.param('length'));
  const text = await getLoremText();
  return c.text(text.slice(0, length));
});

app.get('/rsa/jwk', async (c) => {
  const keyPair = (await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
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
      publicExponent: new Uint8Array([1, 0, 1]),
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
  const text = await getLiteratureText(author);
  return c.text(text.slice(0, length));
});

export default app;
