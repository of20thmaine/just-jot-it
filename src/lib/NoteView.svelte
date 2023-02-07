<script lang="ts">
    import { onMount } from "svelte";

    export let note: Note;

    let node: HTMLElement;

    onMount(() => {

    });
</script>

<div class="note">
    <div class="content"
        contenteditable="true"
        bind:innerHTML={note.content}
        bind:this={node}></div>
</div>

<style>
    .note {
        padding: 0.75rem;
        background-color: var(--textfieldColor);
        margin: 1.0rem 0;
        width: fit-content;
    }
    
    .content {
        font-size: 1.1rem;
        color: var(--fontColor);
    }
</style>