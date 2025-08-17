<script lang="ts">
  import Card from './Card.svelte';
  const { cards }: { cards: TCard[] } = $props();
</script>

<div>
  {#each cards as card}
    <Card {...card} />
  {/each}
</div>

<style global>
  body {
    overflow: auto;
  }

  .Header .Header-content h1 {
    margin-top: 0;
  }

  #content > :nth-child(2) > [data-key='cards']:first-child .card {
    margin-top: 0;
  }

  @media (max-width: 699px) {
    .Header-content {
      margin: 0;
    }
  }

  @media (min-width: 700px) and (max-width: 979px) {
    .Header-media:has(.is-original) {
      margin-left: calc(8.3333333333% + 15px + 75px);
      margin-right: calc(8.3333333333% + 15px + 75px);
    }
  }
  @media (min-width: 980px) {
    #content > div:first-child {
      max-width: 400px;
      width: 40%;
      position: relative;
    }

    #content .Header.u-full.u-full {
      margin: 0 !important;
      padding: 0;
      top: 20px;
      width: auto;
    }

    #content .Header.u-full.u-full.sticky {
      position: sticky;
    }

    .Header .Header-content {
      width: auto;
    }
    .Header .Header-media .Sizer {
      background: transparent;
    }
    .Header .Header-content h1 {
      margin-top: 24px;
    }

    #content {
      width: auto;
      max-width: 1200px;
      display: flex;
      flex-direction: row;
      gap: 64px;
      padding: 64px 55px;
    }

    #content > div {
      width: 60%;
      padding: 0;
      margin: 0;
    }

    #content::after {
      display: none;
    }
  }
</style>
