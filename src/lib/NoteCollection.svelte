<script lang="ts">
    import NoteView from "$lib//NoteView.svelte";
    import { GetAllNotes } from "$lib/db";
</script>

<div class="noteCollection">
    {#await GetAllNotes()}
        <p>Loading.</p>
    {:then notes} 
        {#each notes as note}
            <NoteView note={note}/>
        {/each}
    {/await}
</div>

<style>
    .noteCollection {
        padding: 0 1.0rem;
    }
</style>
