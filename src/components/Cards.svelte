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
  .Header .Header-content h1 {
    margin-top: 0;
  }
  @media (min-width: 700px) and (max-width: 979px) {
    .Header-media:has(.is-original) {
      margin-left: calc(8.3333333333% + 15px + 75px);
      margin-right: calc(8.3333333333% + 15px + 75px);
    }
  }
  @media (min-width: 980px) {
    #content .Header.u-full.u-full {
      max-width: 400px;
      width: 100%;
      margin: 0 !important;
      padding: 0;
      position: sticky;
    }
    .Header .Header-content {
      width: auto;
    }
    .Header .Header-media .Sizer {
      background: transparent;
    }
    .Header .Header-content h1 {
      margin-top: 48px;
    }

    #content {
      width: auto;
      max-width: 1200px;
      display: flex;
      flex-direction: row;
      gap: 64px;
      padding: 0 55px;
    }

    #content > div {
      width: auto;
      padding: 0;
      margin: 0;
    }
    #content::after {
      display: none;
    }
  }
</style>
