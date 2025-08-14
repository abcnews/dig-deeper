import acto from '@abcnews/alternating-case-to-object';
import { getMountValue, isMount } from '@abcnews/mount-utils';
import { DEFAULT_IMAGE_RATIO } from './constants';
import { containsImageElement, fixFig, getEmbeddedImageData, isHTMLElement, isQuote, isTitle } from './utils';
import { parse } from 'valibot';
import { schemaCardConfig } from './schemas';

const parseQuote = (el: HTMLElement): { content: HTMLElement[]; attribution?: HTMLElement } | undefined => {
  const content = el.querySelector('blockquote')?.children;
  if (!content) return;
  const last = content.item(content.length - 1);

  return {
    content: Array.from(content).flatMap(el => (isHTMLElement(el) ? [el] : [])),
    attribution: last?.textContent?.startsWith('—') && isHTMLElement(last) ? last : undefined
  };
};

const parseImage = async (el: HTMLElement) => {
  const img = el.querySelector('img');
  const caption = el.querySelector('figcaption');
  const uri = el.dataset.uri || el.querySelector('a')?.getAttribute('href');
  const id = uri ? uri.substring(uri.lastIndexOf('/') + 1) : caption?.getAttribute('id');
  const alt = img?.getAttribute('alt');
  const src = img?.dataset.src || img?.getAttribute('src');
  const srcset = el.querySelector('picture > source[media="all"]')?.getAttribute('srcset');

  if (typeof id === 'undefined' || id === null || (typeof src !== 'string' && typeof srcset !== 'string')) {
    return null;
  }

  const image: CardImage = {
    alt: alt || '',
    src: src || undefined,
    srcset: srcset || undefined,
    renditions: [],
    alignment: el.className.includes('floatRight') ? 'right' : 'left'
  };
  const embeddedImageData = await getEmbeddedImageData();
  const availableRenditions = embeddedImageData[id].renditions;

  // If there are no renditions, just return what we've got.
  if (availableRenditions.length === 0) {
    return image;
  }

  // Try to find the requested ratio
  const ratios = [embeddedImageData[id].defaultRatio, DEFAULT_IMAGE_RATIO, availableRenditions[0].ratio];

  while (image.renditions.length === 0) {
    const ratio = ratios.shift();
    image.renditions = availableRenditions.filter(d => d.ratio === ratio);
  }

  return image;
};

// TODO: Get all this data from the terminus response instead of the DOM.
// - pass index to Cards component so we know which #startcards #endcards block to use
export const parseDOM = async (el: HTMLElement) => {
  const children = Array.from(el.children);

  return (
    await children.reduce<Promise<CardsCollector>>(async (collectorPromise, child, idx, arr) => {
      const collector = await collectorPromise;

      // If this is a title
      if (isTitle(child)) {
        if (collector.next) {
          collector.cards.push(collector.next);
        }
        collector.next = { title: child.textContent || '', detail: [], config: {} };
        return collector;
      }

      // If this is an image (and we're already collecting)
      if (collector.next && containsImageElement(child)) {
        // If there isn't already an image on this card
        if (!collector.next.image) {
          const image = await parseImage(child);
          if (image !== null) {
            collector.next.image = image;
          }
        } else {
          // Otherwise, there is already a card image, so put this in the content.
          const image = await parseImage(child);
          if (image !== null) {
            collector.next.detail.push(fixFig(child, image));
          }
        }

        return collector;
      }

      // If this is a blockquote
      if (collector.next && isQuote(child) && !collector.next.quote) {
        collector.next.quote = parseQuote(child);
        return collector;
      }

      // Card config
      if (collector.next && isMount(child)) {
        collector.next.config = {
          ...collector.next.config,
          ...parse(schemaCardConfig, acto(getMountValue(child), { propMap: { color: 'colour' } }))
        };
        return collector;
      }

      // Otherwise, this is just content, so push it into the details.
      if (child instanceof HTMLElement) collector.next?.detail.push(child);

      // Add the final card
      if (idx === arr.length - 1 && collector.next) {
        collector.cards.push(collector.next);
        collector.next = undefined;
      }

      return collector;
    }, Promise.resolve({ cards: [] }))
  ).cards;
};
