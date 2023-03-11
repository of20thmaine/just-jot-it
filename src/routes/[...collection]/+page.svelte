<script lang="ts">
    import { onMount } from "svelte";
    import { CreateNote, GetCollection, DeleteNote, UpdateCollectionLastOpen } from "$lib/scripts/db";
    import { DefaultViewModes, EditModes, SetCollectionView, GetCollectionView } from "$lib/scripts/settings";
    import { WindowTitle } from "$lib/scripts/stores";
    import NoteView from "$lib/NoteView.svelte";
    import Toolbar from "$lib/Toolbar.svelte";

    export let data: Collection;
    let view: CollectionView;


    let collectionId: number = data.collectionId;
    let editMode = EditModes[data.editModeId];
    let viewCategoryId: number = data.viewCategoryId;
    let viewOptionId: number = data.viewOptionId;



    let notes: Note[];
    let collectionElement: HTMLElement;
    let noteInput: HTMLElement;
    let forceFocusId: number | null = null;
    let viewModes: ViewModeCategory[] = DefaultViewModes; // Add code to append positionals on load.
    let viewMode: Sortable | Positional = viewModes[viewCategoryId].options[viewOptionId];




    WindowTitle.set(data.name);

    if (instanceOfSortable(viewMode)) {
        GetCollection(data.id, viewMode.sort).then((value) => {notes = value });
    } // else positional
    UpdateCollectionLastOpen(data.id);

    $: if (noteInput) noteInput.focus();
    
    onMount(() => {
        jumpToPageEnd();
    });

    async function initialDataLoad() {
        
    }

    function instanceOfSortable(obj: any): obj is Sortable {
        return "sort" in obj;
    }

    function jumpToPageEnd() {
        collectionElement.scrollTop = collectionElement.scrollHeight;
    }

    function changeEditMode(modeSelection: number) {
        editMode = EditModes[modeSelection];
        if (editMode.id === 1) {
            setTimeout(() => {noteInput.focus()}, 0);
        }
    }

    function freeEditAppend(idx: number) {
        //freeEditAppendOpen = true;
        notes.splice(idx, 0, {id: -1, content: "", created_at: "", updated_at: ""});
        notes = notes;
    }

    function changeViewMode(categoryId: number, optionId: number) {
        if (categoryId < 3) {
            switch (optionId) {
                case 1: notes.sort((a, b) => {
                    return +new Date(a.created_at) - +new Date(b.created_at);
                }); break;
                case 2: notes.sort((a, b) => {
                    return +new Date(b.created_at) - +new Date(a.created_at);
                }); break;
                case 3: notes.sort((a, b) => {
                    return +new Date(a.updated_at) - +new Date(b.updated_at);
                }); break;
                case 4: notes.sort((a, b) => {
                    return +new Date(b.updated_at) - +new Date(a.updated_at);
                }); break;
            }
        } // else positional
        notes = notes;
        viewMode = viewModes[categoryId].options[optionId];
    }

    async function updateCollection() {
        if (instanceOfSortable(viewMode)) {
            notes = await GetCollection(data.collectionId, viewMode.sort);
        }
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
                // Positional
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
        viewModes={viewModes}
        changeEditMode={changeEditMode}
        changeViewMode={changeViewMode}
    />
    <div class="outerCollection" bind:this={collectionElement}>
        <div class="noteCollection">
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
    </div>
    {#if editMode.id === 1}
        <div class="outerEntry">
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

    .outerCollection {
        width: 100%;
        overflow-y: auto;
    }

    .noteCollection {
        margin: 0 auto;
        max-width: var(--usableWidth);
        padding: 0.5rem 1.0rem;
    }

    .outerEntry {
        border-top: 1px solid var(--hoverBtnColor);
        width: 100%;
    }

    .noteEntry {
        margin: 0 auto;
        max-width: var(--usableWidth);
        min-height: 8.0rem;
        padding: 0.5rem;
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
        user-select: none;
        cursor: text;
    }
</style>
