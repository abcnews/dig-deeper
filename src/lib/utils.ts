import { fetchOne, getImages } from '@abcnews/terminus-fetch';
import url2cmid from '@abcnews/url2cmid';

const isDefined = (d: unknown) => typeof d !== 'undefined';

export const isTitle = (el: unknown): el is HTMLHeadingElement =>
  isDefined(el) &&
  el instanceof HTMLHeadingElement &&
  el.tagName === 'H2' &&
  el.textContent !== null &&
  el.textContent.trim().length > 0;

export const isQuote = (el: unknown): el is HTMLElement =>
  isDefined(el) && el instanceof HTMLElement && el.classList.contains('Quote');

export const isHTMLElement = (el: unknown): el is HTMLElement => el instanceof HTMLElement;

export const containsImageElement = (el: unknown): el is HTMLElement =>
  typeof el !== 'undefined' && el instanceof HTMLElement && el.querySelectorAll('img').length > 0;

// TODO: maybe cache this return value
export const getEmbeddedImageData = async () => {
  const id = url2cmid(document.location.href);

  if (!id) {
    throw new Error('Article ID not found.');
  }

  const article = await fetchOne(id);

  const { _embedded } = article;
  const media = _embedded?.mediaEmbedded || [];

  return media.reduce((images, embed: any) => {
    try {
      const widths = [480, 240, 120];
      const imageData = getImages(embed, widths);
      const alt = imageData.alt || '';
      const id = imageData.cmid;

      images[id] = { alt, url: '', renditions: imageData.renditions, defaultRatio: imageData.defaultRatio };
      return images;
    } catch (e) {
      // this ignores embeds which aren't images (which will throw an error when passed to getImages)
      return images;
    }
  }, {} as Record<string, { alt: string; url: string; renditions: ImageRendition[]; defaultRatio?: string }>);
};

// Ensure images inside cards have src attributes
export const fixFig = (el: HTMLElement, image: CardImage) => {
  const img = el.querySelector('img');
  if (img) {
    img.setAttribute('src', image.renditions[0].url);
    img.setAttribute('srcset', image.renditions.map(d => `${d.url} ${d.width}w`).join(','));
  }
  return el;
};
