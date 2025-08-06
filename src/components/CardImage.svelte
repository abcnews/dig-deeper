<script lang="ts">
  let { alt, url, renditions, alignment }: CardImage = $props();
</script>

<img src={url} srcset={renditions.map(d => `${d.url} ${d.width}w`).join(',')} sizes="120px" {alt} class={alignment} />

<style>
  img {
    position: absolute;
    top: 0;
    width: 85px;
    transform: translateY(-50%);
  }

  img.left {
    left: 0;
  }
  img.right {
    right: 0;
  }
</style>
