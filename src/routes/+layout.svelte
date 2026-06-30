<script lang="ts">
  import "../app.css";

  import favicon from "$lib/assets/favicon.svg";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import AddRecipeModal from "$lib/components/recipe/create/AddRecipeModal.svelte";
  import * as Tooltip from "$lib/components/ui/tooltip/";

  const { children, data } = $props();

  // modalOpen is reassigned through a function passed into <Header>
  // oxlint-disable-next-line prefer-const
  let modalOpen = $state<boolean>(false);
</script>

<svelte:head>
  <title>Jroyvibes' Cookbook</title>
  <meta name="description" content="A collection of recipes, made by Jroyvibes. Comparable to Betty Crocker" />
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
  <Header session={data.session} onAddRecipe={() => (modalOpen = true)} />
  <main class="flex-1 pb-16">
    <Tooltip.Provider delayDuration={200}>
      {@render children()}
    </Tooltip.Provider>
  </main>
  <Footer />
  <AddRecipeModal bind:open={modalOpen} allTags={data.allTags} />
</div>
