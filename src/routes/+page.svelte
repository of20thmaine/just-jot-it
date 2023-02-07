<script lang="ts">
    import NoteCollection from "$lib/NoteCollection.svelte";
    import NoteInput from "$lib/NoteInput.svelte";
    import TitleBar from "$lib/TitleBar.svelte";
</script>

<TitleBar />
<div class="page">
    <div class="noteCollection">
        <NoteCollection />
    </div>
    <div class="noteEntry">
        <NoteInput />
    </div>
</div>

<style>
    .page {
        margin-top: 30px;
        height: calc(100vh - 30px);

        display: grid;
        grid-template-rows: 1fr min-content;
    }

    .noteCollection {
        overflow-y: scroll;
    }

    .noteEntry {
        min-height: 8.0rem;
        padding: 0.5rem;
    }


    /* width */
    ::-webkit-scrollbar {
        width: 16px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: none;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #252526; 
        border-radius: 8px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #2d2d2d; 
    }
</style>
