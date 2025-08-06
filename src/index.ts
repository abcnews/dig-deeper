import { requestDOMPermit, whenOdysseyLoaded } from '@abcnews/env-utils';
import { mount } from 'svelte';
import { COLOURS, DECOY_KEY } from './lib/constants';
import { proxy } from '@abcnews/dev-proxy';
import { parseDOM } from './lib/parse';
import Cards from './components/Cards.svelte';

const init = async () => {
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
