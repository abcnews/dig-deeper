<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import CardImage from './CardImage.svelte';
  import type { EventHandler } from 'svelte/elements';

  let { title, quote, image, detail, config }: TCard = $props();
  const attachDetails: Attachment = el => {
    detail.forEach(d => el.appendChild(d));
  };

  const attachQuote: Attachment = el => {
    quote?.content.forEach(d => el.appendChild(d));
    if (quote?.attribution) {
      const cite = document.createElement('cite');
      cite.appendChild(quote.attribution);
      el.appendChild(cite);
    }
  };

  let open = $state(false);

  const ontoggle: EventHandler<Event, HTMLDetailsElement> = event => {
    open = event.currentTarget.open;
    if (!open && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };
</script>

<div class="card image-alignment-{image?.alignment}" style:background="#{config.colour}">
  <h2>{title}</h2>
  {#if image}
    <CardImage {...image} />
  {/if}

  <blockquote>
    <div {@attach attachQuote}></div>
  </blockquote>
  <details class:open {ontoggle} {@attach attachDetails}>
    <summary
      >{#if open}Show less{:else}Read more{/if}</summary
    >
  </details>
</div>

<style>
  .card {
    position: relative;
    padding: 48px 35px;
    border-radius: 12px;
    margin: 48px 0;
  }

  @media (min-width: 700px) {
    .card.image-alignment-left {
      margin-left: 46px;
    }
    .card.image-alignment-right {
      margin-right: 46px;
    }
  }

  h2 {
    font-size: 2rem;
    margin-top: 0;
    font-family: var(--dls-font-stack-serif, 'abcserif', 'Book Anitqua', 'Palatino Linotype', palatino, serif);
    line-height: 1.2;
    font-weight: 600;
  }

  blockquote {
    font-family: var(--dls-font-stack-serif, 'abcserif', 'Book Anitqua', 'Palatino Linotype', palatino, serif);
    font-size: 1.125rem;
    line-height: 1.5;
    margin: 21px 0;
  }

  blockquote :global(cite) {
    font-family: var(
      --dls-font-stack-sans,
      'abcsans',
      -apple-system,
      blinkmacsystemfont,
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      arial,
      sans-serif
    );
    font-weight: 700;
    line-height: 1.4;
    font-size: 0.875rem;
  }

  details {
    position: relative;
  }

  details > :global(:last-child) {
    margin-bottom: 0;
  }

  summary {
    display: block;
    position: sticky;
    top: 10px;
    margin: 0 auto;
    width: max-content;
    padding: 7px 14px 6px;
    border-radius: 100px;
    background: var(--Button-button-primary, #10316a);
    color: var(--Text-text-inverse, #fff);
    font-family: var(--dls-font-stack-sans);
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.35;
  }

  summary::after {
    content: '';
    display: inline-block;
    width: 13.333px;
    height: 6.667px;
    margin-left: 0.5rem;
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSI5IiBmaWxsPSJub25lIj48cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMS42NjciIGQ9Ik0xNC4xNjcuNjY3IDcuNSA3LjMzMy44MzMuNjY3Ii8+PC9zdmc+);
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
    transition: all 0.3s linear;
  }

  details[open] summary {
    margin-bottom: 10px;
  }

  details[open] summary::after {
    transform: rotate(180deg) translate(0, 2px);
  }
</style>
