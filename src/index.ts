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
    random: '/random',
  });
});

app.get('/random', (c) => {
  return c.json({
    number: '/random/number/:length',
    alphabet: '/random/alphabet/:length',
    alphaUpper: '/random/alphaUpper/:length',
    alphaLower: '/random/alphaLower/:length',
    alphaNumeric: '/random/alphaNumeric/:length',
    alphaNumericUpper: '/random/alphaNumericUpper/:length',
    alphaNumericLower: '/random/alphaNumericLower/:length',
    symbol: '/random/symbol/:length',
    alphaNumericSymbol: '/random/alphaNumericSymbol/:length',
    alphaNumericSymbolUpper: '/random/alphaNumericSymbolUpper/:length',
    alphaNumericSymbolLower: '/random/alphaNumericSymbolLower/:length',
    hiragana: '/random/hiragana/:length',
    katakana: '/random/katakana/:length',
    kanji: '/random/kanji/:length',
    kanji2: '/random/kanji2/:length',
    japanese: '/random/japanese/:length',
    lorem: '/random/lorem/:length',
    author: '/random/:author/:length',
  });
});

app.get('/random/number/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomNumber = picker(length, NUMBER);
  return c.text(randomNumber);
});

app.get('/random/alphabet/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphabet = picker(length, ALPHABET_UPPER + ALPHABET_LOWER);
  return c.text(randomAlphabet);
});

app.get('/random/alphaUpper/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaUpper = picker(length, ALPHABET_UPPER);
  return c.text(randomAlphaUpper);
});

app.get('/random/alphaLower/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaLower = picker(length, ALPHABET_LOWER);
  return c.text(randomAlphaLower);
});

app.get('/random/alphaNumeric/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumeric = picker(length, ALPHABET_UPPER + ALPHABET_LOWER + NUMBER);
  return c.text(randomAlphaNumeric);
});

app.get('/random/alphaNumericUpper/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphanumericUpper = picker(length, ALPHABET_UPPER + NUMBER);
  return c.text(randomAlphanumericUpper);
});

app.get('/random/alphaNumericLower/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericLower = picker(length, ALPHABET_LOWER + NUMBER);
  return c.text(randomAlphaNumericLower);
});

app.get('/random/symbol/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomSymbol = picker(length, SYMBOL);
  return c.text(randomSymbol);
});

app.get('/random/alphaNumericSymbol/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericSymbol = picker(
    length,
    ALPHABET_UPPER + ALPHABET_LOWER + NUMBER + SYMBOL
  );
  return c.text(randomAlphaNumericSymbol);
});

app.get('/random/alphaNumericSymbolUpper/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericSymbolUpper = picker(length, ALPHABET_UPPER + NUMBER + SYMBOL);
  return c.text(randomAlphaNumericSymbolUpper);
});

app.get('/random/alphaNumericSymbolLower/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomAlphaNumericSymbolLower = picker(length, ALPHABET_LOWER + NUMBER + SYMBOL);
  return c.text(randomAlphaNumericSymbolLower);
});

app.get('/random/hiragana/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomHiragana = picker(length, HIRAGANA);
  return c.text(randomHiragana);
});

app.get('/random/katakana/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomKatakana = picker(length, KATAKANA);
  return c.text(randomKatakana);
});

app.get('/random/kanji/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomKanji = picker(length, KANJI1);
  return c.text(randomKanji);
});

app.get('/random/kanji2/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomKanji = picker(length, KANJI2);
  return c.text(randomKanji);
});

app.get('/random/japanese/:length', (c) => {
  const length = parseInt(c.req.param('length'));
  const randomJapanese = picker(length, [
    { characters: HIRAGANA, ratio: 0.3 },
    { characters: KATAKANA, ratio: 0.3 },
    { characters: KANJI1, ratio: 0.4 },
  ]);
  return c.text(randomJapanese);
});

app.get('/random/lorem/:length', async (c) => {
  const length = parseInt(c.req.param('length'));
  const text = await getLoremText();
  return c.text(text.slice(0, length));
});

app.get('/random/:author/:length', async (c) => {
  const length = parseInt(c.req.param('length'));
  const author = c.req.param('author');
  const text = await getLiteratureText(author);
  return c.text(text.slice(0, length));
});

export default app;
