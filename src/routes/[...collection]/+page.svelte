<script lang="ts">
    import { onMount } from "svelte";
    import { CreateNote, GetCollection, DeleteNote, EditModes, ViewModes } from "$lib/scripts/db";
    import { WindowTitle } from "$lib/scripts/stores";
    import NoteView from "$lib/NoteView.svelte";
    import Toolbar from "$lib/Toolbar.svelte";

    export let data: CollectionView;

    let notes: Note[];
    let collectionId: number = data.collectionId;
    let collectionElement: HTMLElement;
    let noteInput: HTMLElement;
    let forceFocusId: number | null = null;
    let editMode = EditModes[data.editModeId];
    let viewMode = ViewModes[data.viewModeId];

    WindowTitle.set(data.collectionName);

    GetCollection(data.collectionId, viewMode.type).then((value) => {notes = value });
    
    onMount(() => {
        jumpToPageEnd();
        if (editMode.id === 0) {
            setTimeout(() => {noteInput.focus()}, 0);
        }
    });

    function jumpToPageEnd() {
        collectionElement.scrollTop = collectionElement.scrollHeight;
    }

    function changeEditMode(modeSelection: number) {
        editMode = EditModes[modeSelection];
        if (editMode.id === 0) {
            setTimeout(() => {noteInput.focus()}, 0);
        }
    }

    function freeEditAppend(idx: number) {
        //freeEditAppendOpen = true;
        notes.splice(idx, 0, {id: -1, content: "", created_at: "", updated_at: ""});
        notes = notes;
    }

    function changeViewMode(modeSelection: number) {
        switch (modeSelection) {
            case 0: notes.sort((a, b) => {
                return +new Date(a.created_at) - +new Date(b.created_at);
            }); break;
            case 1: notes.sort((a, b) => {
                return +new Date(b.created_at) - +new Date(a.created_at);
            }); break;
            case 2: notes.sort((a, b) => {
                return +new Date(a.updated_at) - +new Date(b.updated_at);
            }); break;
            case 3: notes.sort((a, b) => {
                return +new Date(b.updated_at) - +new Date(a.updated_at);
            }); break;
        }
        notes = notes;
        viewMode = ViewModes[modeSelection];
    }

    async function updateCollection() {
        notes = await GetCollection(data.collectionId, viewMode.type);
    }

    /**
     * changeType:
     * 0: Enter key
     * 1: Arrow-Up
     * 2: Arrow-Down
     * 3: After Delete (neutral)
    */
    function forceFocusChange(currentFocusIdx: number, changeType: number) {
        if (changeType === 0) {
            if (viewMode.id <= 3) {
                if (notes[currentFocusIdx+1]) {
                    forceFocusId = notes[currentFocusIdx+1].id;
                } else {
                    changeEditMode(0);
                }
            } else {
                // Free Edit Append Handling. May the Gods have mercy on your soul.
            }
        } else if (changeType === 1) {
            if (notes[currentFocusIdx-1]) {
                forceFocusId = notes[currentFocusIdx-1].id;
            }
        } else if (changeType === 2) {
            if (notes[currentFocusIdx+1]) {
                forceFocusId = notes[currentFocusIdx+1].id;
            } 
        } else if (changeType === 3) {
            if (notes[currentFocusIdx+1]) {
                forceFocusId = notes[currentFocusIdx+1].id;
            } else if (notes[currentFocusIdx-1]) {
                forceFocusId = notes[currentFocusIdx-1].id;
            }
        }
    }

    async function deleteNoteHandler(noteId: number, noteIdx: number) {
        DeleteNote(noteId)
            .then(() => {updateCollection()
            .then(() => {forceFocusChange(noteIdx-1, 3)})});
    }

    // Ensure these key handlers are only accesible in editing mode
    function editingKeyHandler(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;

        switch (event.key) {
            case "Enter":
                event.preventDefault();
                if (target.innerHTML.length > 0) {
                    CreateNote(target.innerHTML, collectionId);
                    updateCollection().then(() => {jumpToPageEnd();});
                    target.innerHTML = "";
                }
                break;
        }
    }
</script>

<div class="page">
    <Toolbar
        editMode={editMode}
        viewMode={viewMode}
        changeEditMode={changeEditMode}
        changeViewMode={changeViewMode}
    />
    <div class="noteCollection" bind:this={collectionElement}>
        {#if notes}
            {#each notes as note, i}
                <NoteView 
                    bind:note={note} 
                    idx={i} 
                    editMode={editMode.id} 
                    bind:forceFocusId={forceFocusId} 
                    forceFocusChange={forceFocusChange}
                    deleteNoteHandler={deleteNoteHandler} />
            {/each}
        {:else}
            <p>Loading Collection...</p>
        {/if}
    </div>

    {#if editMode.id === 0}
        <div class="noteEntry">
            <div class="inputArea">
                <div class="noteInput"
                    contenteditable="true"
                    on:keydown={editingKeyHandler}
                    bind:this={noteInput}
                    placeholder="Append new note">
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .page {
        /* margin: 0 auto;
        max-width: var(--usableWidth); */

        margin-top: var(--titlebarHeight);
        height: calc(100vh - var(--titlebarHeight));
        display: grid;
        grid-template-rows: min-content 1fr min-content;
    }

    .noteCollection {
        padding: 0.5rem 1.0rem;
        overflow-y: auto;
    }

    .noteEntry {
        min-height: 8.0rem;
        padding: 0.5rem;
        border-top: 1px solid var(--hoverBtnColor);
    }

    .inputArea {
        padding: 0.5rem;
    }

    .noteInput {
        border-radius: 8px;
        background-color: var(--textfieldColor);
        padding: 0.5rem;
        color: var(--fontColor);
        line-height: 1.84rem;
        min-height: 5.52rem;
        font-size: 1.15rem;
    }

    [contenteditable=true]:empty:before {
        content:attr(placeholder);
        color: grey;
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
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #2d2d2d; 
    }
</style>
