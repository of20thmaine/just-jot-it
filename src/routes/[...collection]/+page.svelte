<script lang="ts">
    import { onMount } from "svelte";
    import { CreateNote, GetCollection, DeleteNote, EditModes, ViewModes } from "$lib/db";
    import { WindowTitle } from "$lib/stores";
    import Note from "$lib/Note.svelte";
    import Toolbar from "$lib/Toolbar.svelte";

    export let data: CollectionView;

    let collectionId: number = data.collectionId;
    let collectionElement: HTMLElement;
    let noteInput: HTMLElement;
    let forceFocusId: number = -1;
    let editMode = EditModes[data.editModeId];
    let viewMode = ViewModes[data.viewModeId];
    let freeEditAppendOpen = false;

    WindowTitle.set(data.collectionName);
    
    onMount(() => {
        jumpToPageEnd();
        if (editMode.id === 0) {
            setTimeout(() => {makeFocusNode(noteInput);}, 0);
        }
    });

    function jumpToPageEnd() {
        collectionElement.scrollTop = collectionElement.scrollHeight;
    }

    function changeEditMode(modeSelection: number) {
        editMode = EditModes[modeSelection];
    }

    function changeViewMode(modeSelection: number) {
        switch (modeSelection) {
            case 0: data.notes.sort((a, b) => {
                return +new Date(a.created_at) - +new Date(b.created_at);
            }); break;
            case 1: data.notes.sort((a, b) => {
                return +new Date(b.created_at) - +new Date(a.created_at);
            }); break;
            case 2: data.notes.sort((a, b) => {
                return +new Date(a.updated_at) - +new Date(b.updated_at);
            }); break;
            case 3: data.notes.sort((a, b) => {
                return +new Date(b.updated_at) - +new Date(a.updated_at);
            }); break;
        }
        data.notes = data.notes; // Svelte reactivity feature.
        viewMode = ViewModes[modeSelection];
    }

    async function updateCollection() {
        data.notes = await GetCollection(data.collectionId, viewMode.type);
    }

    /**
     * Direction: -1 down, 1 up, 0/else neutral.
    */
    function forceFocusChange(currentFocusIdx: number, direction: number) {
        if (direction === 1) {
            if (data.notes[currentFocusIdx+1]) {
                forceFocusId = data.notes[currentFocusIdx+1].id;
                return;
            }
        } else if (direction === -1) {
            if (data.notes[currentFocusIdx-1]) {
                forceFocusId = data.notes[currentFocusIdx-1].id;
                return;
            }
        } else {
            if (data.notes[currentFocusIdx+1]) {
                forceFocusId = data.notes[currentFocusIdx+1].id;
                return;
            } else if (data.notes[currentFocusIdx-1]) {
                forceFocusId = data.notes[currentFocusIdx-1].id;
                return;
            }
        }
        forceFocusId = -1;
    }

    async function deleteNoteHandler(noteId: number, noteIdx: number) {
        DeleteNote(noteId)
            .then(() => {updateCollection()
            .then(() => {forceFocusChange(noteIdx-1, 0)})});
    }

    function makeFocusNode(node: HTMLElement) {
        let range = document.createRange();
        range.selectNodeContents(node);
        range.collapse(false);

        let sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);

        node.focus();
        range.detach();
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
        {#if data.notes}
            {#each data.notes as note, i}
                <Note 
                    bind:note={note} 
                    idx={i} 
                    editMode={editMode.id} 
                    bind:forceFocusId={forceFocusId} 
                    forceFocusChange={forceFocusChange}
                    deleteNoteHandler={deleteNoteHandler} />
            {/each}
            {#if editMode.id === 1 && !freeEditAppendOpen}
                <div class="freeEditAppendBtn"
                        on:click={() => freeEditAppendOpen = true}
                        on:keypress={() => freeEditAppendOpen = true}>
                    <i class="bi bi-plus-lg"></i>
                    <div class="btnTxt">Append</div>
                </div>
            {:else if editMode.id === 1 && freeEditAppendOpen}
                <div class="freeEditAppender"></div>
            {/if}
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

    .freeEditAppendBtn {
        color: #3cb452;
        display: flex;
        border: 1px solid;
        width: fit-content;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        align-items: center;
        background-color: var(--textfieldColor);
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .btnTxt {
        margin-left: 0.5rem;
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
