<script lang="ts">
  import Card from './Card.svelte';
  const { cards }: { cards: TCard[] } = $props();
</script>

<div>
  {#each cards as card}
    <Card {...card} />
  {/each}
</div>
