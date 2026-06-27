<script lang="ts">
  import { ArrowLeft, Check, Pencil, Trash2, X } from "@lucide/svelte";

  import ReturnToHomeButton from "$lib/components/ReturnToHomeButton.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import type { PageProps } from "./$types";

  import { invalidateAll } from "$app/navigation";

  const { data }: PageProps = $props();

  let tags = $state([...data.allTags]);
  let editingId = $state<number | null>(null);
  let editingName = $state<string>("");

  function startEdit(id: number, name: string) {
    editingId = id;
    editingName = name;
  }

  function cancelEdit() {
    editingId = null;
    editingName = "";
  }

  async function saveEdit(id: number) {
    const res = await fetch(`/api/tags/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName })
    });

    if (res.ok) {
      const updated = await res.json();
      const index = tags.findIndex(t => t.id === id);
      if (index !== -1) tags[index] = updated;
      tags.sort((a, b) => a.name.localeCompare(b.name));
      cancelEdit();
      await invalidateAll();
    }
  }

  async function deleteTag(id: number) {
    const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
    if (res.ok) {
      tags = tags.filter(t => t.id !== id);
      await invalidateAll();
    }
  }

  function onKeydown(e: KeyboardEvent, id: number) {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") cancelEdit();
  }
</script>

<div class="mx-auto max-w-2xl px-6 pt-24 pb-16">
  <ReturnToHomeButton />

  <h1 class="font-serif text-3xl mb-8">Manage tags</h1>

  {#if tags.length === 0}
    <span class="text-muted-foreground">No tags yet. Create some using the Add recipe button!</span>
  {:else}
    <ul class="flex flex-col divide-y divide-border">
      {#each tags as tag (tag.id)}
        <li class="flex flex-row items-center justify-between py-3 gap-4">
          {#if editingId === tag.id}
            <Input bind:value={editingName} onkeydown={e => onKeydown(e, tag.id)} class="max-w-64" autofocus />
            <div class="flex gap-2">
              <Button size="icon" variant="ghost" onclick={() => saveEdit(tag.id)}>
                <Check size={16} />
              </Button>
              <Button size="icon" variant="ghost" onclick={cancelEdit}>
                <X size={16} />
              </Button>
            </div>
          {:else}
            <span class="text-sm">{tag.name}</span>
            <div class="flex gap-2">
              <Button size="icon" variant="ghost" onclick={() => startEdit(tag.id, tag.name)}>
                <Pencil size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                class="text-muted-foreground hover:text-destructive"
                onclick={() => deleteTag(tag.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
