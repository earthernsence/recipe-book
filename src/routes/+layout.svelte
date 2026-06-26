<script lang="ts">
  import "../app.css";

  import favicon from "$lib/assets/favicon.svg";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";

  const { children } = $props();
</script>

<svelte:head>
  <title>Jroyvibes Recipe Book</title>
  <meta name="description" content="A collection of recipes, made by Jroyvibes" />
  <link rel="icon" href={favicon} />
</svelte:head>

<Header />
<main class="pb-16">
  {@render children()}
</main>
<Footer />
