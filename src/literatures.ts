import akutagawa from './data/akutagawa.json';
import dazai from './data/dazai.json';
import edogawa from './data/edogawa.json';
import natsume from './data/natsume.json';
import lorem from './data/lorem.json';

export async function getLiteratureText(author: string, random = Math.random) {
  const segmenter = new Intl.Segmenter('ja', { granularity: 'sentence' });

  let text = '';
  switch (author) {
    case 'akutagawa':
      text = Object.values(akutagawa).join('');
      break;
    case 'dazai':
      text = Object.values(dazai).join('');
      break;
    case 'edogawa':
      text = Object.values(edogawa).join('');
      break;
    case 'natsume':
      text = Object.values(natsume).join('');
      break;
    default:
      text = Object.values(akutagawa).join('');
  }
  const segments = segmenter.segment(text);
  const sentences = Array.from(segments, (segment) => segment.segment);
  return sentences.sort(() => random() - 0.5).join('');
}

export async function getLoremText(random = Math.random) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
  const text = Object.values(lorem).join('');
  const segments = segmenter.segment(text);
  const sentences = Array.from(segments, (segment) => segment.segment);
  return sentences.sort(() => random() - 0.5).join('');
}
