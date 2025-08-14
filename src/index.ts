import { requestDOMPermit, whenOdysseyLoaded } from '@abcnews/env-utils';
import { mount } from 'svelte';
import { COLOURS, DECOY_KEY } from './lib/constants';
import { proxy } from '@abcnews/dev-proxy';
import { parseDOM } from './lib/parse';
import Cards from './components/Cards.svelte';

const init = async () => {
  // Move some stuff around to make a side header possible.
  const articleContent = document.createElement('div');
  const articleHeader = document.createElement('div');
  const header = document.querySelector('.Header');
  document.querySelectorAll('#content > *:not(.Header)').forEach(el => articleContent.appendChild(el));
  header && articleHeader.appendChild(header);
  document.querySelector('#content')?.appendChild(articleHeader);
  document.querySelector('#content')?.appendChild(articleContent);

  const sizer = header?.querySelector('.Sizer');

  const observer = new ResizeObserver(
    ([
      {
        borderBoxSize: [{ blockSize: height }]
      }
    ]) => {
      if (height < window.innerHeight) {
        header?.classList.add('sticky');
      } else {
        header?.classList.remove('sticky');
      }

      // This weird and ugly thing is to clobber Odyssey's erroneous application of a height that assumes full width of header
      if (sizer && sizer instanceof HTMLElement) {
        setTimeout(() => {
          sizer.style.removeProperty('padding-top');

          const { width, height } = sizer.getBoundingClientRect();
          const snappedHeight = Math.round(height);

          if (height !== snappedHeight) {
            sizer.style.setProperty('padding-top', `${snappedHeight}px`);
          }
        });
      }
    }
  );
  header && observer.observe(header);

  const instances = await requestDOMPermit(DECOY_KEY, init);

  if (instances === true) {
    return console.error(new Error('requestDOMPermit thinks this is not PL'));
  }

  instances.forEach(async target => {
    target.dataset['used'] = 'true';
    const cards = await parseDOM(target);
    cards.forEach((d, i) => {
      if (!d.config.colour) {
        d.config.colour = COLOURS[i % COLOURS.length];
      }
    });
    target.innerHTML = '';
    mount(Cards, { target, props: { cards } });
  });
};

Promise.all([whenOdysseyLoaded, proxy('dig-deeper')]).then(init);

if (process.env.NODE_ENV === 'development') {
  console.debug(`[dig-deeper] public path: ${__webpack_public_path__}`);
}
