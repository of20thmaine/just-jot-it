<script lang="ts">
    import { onMount, tick } from "svelte";
    import { CreateNote, UpdateNote, DeleteNote } from "./db";

    export let note: string = "";
    export let id: number = -1;

    let noteIsCreated: boolean = false;
    let noteBeingSaved: boolean = false;
    let noteInput: HTMLElement;

    $: {
        if (note.length > 0) {
            noteBeingSaved = true;
            if (noteIsCreated) {
                UpdateNote(id, note);
            } else {
                CreateNote(note).then((value) => {
                    id = value.lastInsertId;
                });
            }
            console.log(1);
            noteBeingSaved = false;
            noteIsCreated = true;
        } else {
            if (noteIsCreated) {
                DeleteNote(id);
                noteIsCreated = false;
                id = -1;
            }
        }
    }

    onMount(async () => {
        await tick(); // For the love of the gods let there be a better way than this silliness.
        noteInput.focus();
    });
</script>

<div class="inputArea">
    <div class="noteInput"
        contenteditable="true"
        bind:this={noteInput}
        bind:innerHTML={note}>
    </div>
    {#if !noteIsCreated && !noteBeingSaved}
        <div class="status">To create a note, start typing.</div>
    {:else if noteBeingSaved}
        <div class="status">Saving...</div>
    {:else}
        <div class="status">Saved</div>
    {/if}
</div>

<style>
    .inputArea {
        padding: 2.0rem;
    }

    .noteInput {
        border: 1px solid var(--borderColor);
        border-radius: 4px;
        background-color: var(--textfieldColor);
        padding: 0.5rem;
        color: var(--fontColor);
        line-height: 1.84rem;
        min-height: 5.52rem;
        font-size: 1.15rem;
    }

    .noteInput:focus {
        outline: 1px solid var(--highlightColor);
    }

    .createBtn {
        background-color: #238636;
        color: white;
        width: 180px;
        text-align: center;
        font-weight: 600;
        padding: 0.4rem;
        margin-top: 2.0rem;
        border: 1px solid var(--borderColor);
        border-radius: 4px;
    }

    .createBtn:hover {
        background-color: #2ea043;
        cursor: pointer;
    }
</style>
