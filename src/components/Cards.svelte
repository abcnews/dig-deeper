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
    .Header .Header-content h1 {
      margin-top: 48px;
    }
  }
</style>
