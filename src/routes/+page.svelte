<script lang="ts">
    import { CreateNote, GetAllNotes } from "$lib/db";

    let notes: Note[];
    let collectionId: number = 1;

    const EditModes = [
        {id: 0, name: 'Append', class: 'append', icoClass: 'bi bi-plus'},
        {id: 1, name: 'Free-Edit', class: 'editing', icoClass: 'bi bi-pen tIco'},
        {id: 2, name: 'Read-Only', class: 'readOnly', icoClass: 'bi bi-lock sIco'}
    ];
    let editMode = EditModes[0];
    let showEditModeSelect = false;

    const ViewModes = [
        {id: 0, name: "Date Added", leftIco: "bi bi-arrow-down-up", rightIco: "bi bi-sort-numeric-down-alt"},
        {id: 1, name: "Date Added", leftIco: "bi bi-arrow-down-up", rightIco: "bi bi-sort-numeric-down"},
        {id: 2, name: "Date Modified", leftIco: "bi bi-arrow-down-up", rightIco: "bi bi-sort-numeric-down-alt"},
        {id: 3, name: "Date Modified", leftIco: "bi bi-arrow-down-up", rightIco: "bi bi-sort-numeric-down"},
    ];
    let viewMode = ViewModes[0];
    let showViewModeSelect = false;
    

    function changeEditMode(modeSelection: number) {
        editMode = EditModes[modeSelection];
        showEditModeSelect = false;
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
        notes = notes; // Svelte reactivity feature.
        viewMode = ViewModes[modeSelection];
        showViewModeSelect = false;
    }

    function toggleShowEditMode() {
        showEditModeSelect = !showEditModeSelect;
    }

    function toggleShowViewMode() {
        showViewModeSelect = !showViewModeSelect;
    }

    updateCollection();

    function updateCollection() {
        GetAllNotes().then((value) => {notes = value});
    }

    // Ensure these key handlers are only accesible in editing mode
    function editingKeyHandler(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;

        switch (event.key) {
            case "Enter":
                event.preventDefault();
                if (target.innerHTML.length > 0) {
                    CreateNote(target.innerHTML, collectionId);
                    updateCollection();
                    target.innerHTML = "";
                }
                break;
        }
    }

    $: {
        for (let note in notes) {

        }
    }



</script>

<div class="page">

    <div class="toolBar">

        <div class="selector {editMode.class}"
            on:click={() => {toggleShowEditMode()}}
            on:keypress={() => {toggleShowEditMode()}}>
                <div class="ico"><i class="{editMode.icoClass}"></i></div>
                <div class="name">{editMode.name}</div>
                <div class="tIco"><i class="bi bi-chevron-down"></i></div></div>
        {#if showEditModeSelect}
            <div class="blinder"
                    on:click={() => {toggleShowEditMode()}}
                    on:keypress={() => {toggleShowEditMode()}}></div>
            <div class="selectorMenu">
                {#each EditModes as mode}
                    <div class="menuItm {mode.class}"
                            on:click={() => {changeEditMode(mode.id)}}
                            on:keypress={() => {changeEditMode(mode.id)}}>
                        <div class="ico"><i class="{mode.icoClass}"></i></div>
                        <div class="name">{mode.name}</div>
                    </div>
                {/each}
            </div>
            
        {/if}

        <div class="viewModeSelector"
            on:click={() => {toggleShowViewMode()}}
            on:keypress={() => {toggleShowViewMode()}}>
                <div class="leftIco"><i class="{viewMode.leftIco}"></i></div>
                <div class="viewModeName">{viewMode.name}</div>
                <div class="rightIco"><i class="{viewMode.rightIco}"></i></div></div>
        {#if showViewModeSelect}
            <div class="blinder"
                on:click={() => {toggleShowViewMode()}}
                on:keypress={() => {toggleShowViewMode()}}></div>
            <div class="viewModeSelectorMenu">
                <div class="cat">
                    <i class="bi bi-arrow-down-up"></i>
                    <div class="catName">Date Added:</div>
                </div>
                    <div class="catItm"
                            on:click={() => {changeViewMode(0)}}
                            on:keypress={() => {changeViewMode(0)}}>
                        <div class="catItmName">Old to New</div>
                        <i class="bi bi-sort-numeric-down-alt"></i>
                    </div>
                    <div class="catItm"
                            on:click={() => {changeViewMode(1)}}
                            on:keypress={() => {changeViewMode(1)}}>
                        <div class="catItmName">New to Old</div>
                        <i class="bi bi-sort-numeric-down"></i>
                    </div>
                <div class="cat">
                    <i class="bi bi-arrow-down-up"></i>
                    <div class="catName">Date Modified:</div>
                </div>
                    <div class="catItm"
                            on:click={() => {changeViewMode(2)}}
                            on:keypress={() => {changeViewMode(2)}}>
                        <div class="catItmName">Old to New</div>
                        <i class="bi bi-sort-numeric-down-alt"></i>
                    </div>
                    <div class="catItm"
                            on:click={() => {changeViewMode(3)}}
                            on:keypress={() => {changeViewMode(3)}}>
                        <div class="catItmName">New to Old</div>
                        <i class="bi bi-sort-numeric-down"></i>
                    </div>
                <div class="cat">
                    <i class="bi bi-list-ol"></i>
                    <div class="catName">Positional:</div>
                </div>
                <div class="catItm">
                    <div class="catItmName">Create New</div>
                    <i class="bi bi-plus-lg"></i>
                </div>
            </div>
        {/if}
        
    </div>

    <div class="noteCollection">
        {#if notes}
            {#each notes as note}
                <!-- This way looks dumb a.f. but it plays so nicely with svelte's built-in
                reactivity it actually prevents massive complexity later with only tradeoff
                being looking stupid. (contenteditable cannot be dynamic w/ bind of innerHTML) -->
                {#if editMode.id === 1}
                    <div class="noteContent"
                        contenteditable="true"
                        bind:innerHTML={note.content}>
                    </div>
                {:else}
                    <div class="noteContent"
                        contenteditable="false"
                        bind:innerHTML={note.content}>
                    </div>
                {/if}
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
                    on:keydown={editingKeyHandler}>
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

    .toolBar {
        padding: 0.3rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--hoverBtnColor);
    }

    .selector {
        padding: 0 0.4rem;
        border: 1px dashed;
        display: flex;
        align-items: center;
        width: 130px;
        height: 26px;
        background-color: var(--textfieldColor);
        cursor: pointer;
        user-select: none;
    }

    .selector:hover {
        border: 1px solid;
    }

    .selectorMenu {
        position: fixed;
        z-index: 3;
        top: 64px;
        left: 0.3rem;
        width: 130px;
        background-color: var(--backgroundColor);
        border: 1px solid var(--borderColor);
        cursor: pointer;
    }

    .menuItm {
        display: flex;
        align-items: center;
        padding: 0.2rem 0.4rem;
        border: 1px solid transparent;
    }

    .menuItm:hover {
        border: 1px solid currentColor;
        background-color: var(--textfieldColor);
    }

    .name {
        margin: 0 auto;
        font-size: 0.8rem;
    }

    .ico {
        font-size: 1.0rem;
    }

    .sIco {
        font-size: 0.9rem;
    }

    .tIco {
        font-size: 0.7rem;
    }

    .viewModeSelector {
        margin-left: 0.4rem;
        display: flex;
        align-items: center;
        cursor: pointer;
        background-color: var(--textfieldColor);
        color: #4fb8fe;
        font-size: 0.8rem;
        min-width: 142px;
        height: 26px;
        padding: 0 0.4rem;
        border: 1px dashed #4fb8fe;
        user-select: none;
    }

    .viewModeSelector:hover {
        border: 1px solid;
    }

    .viewModeSelectorMenu {
        position: fixed;
        z-index: 3;
        top: 64px;
        left: 140px;
        background-color: var(--backgroundColor);
        border: 1px solid var(--borderColor);
        color: var(--fontColor);
        padding: 0.4rem;
        font-size: 0.8rem;
        min-width: 142px;
    }

    .viewModeName {
        margin: 0 auto;
    }

    .cat {
        display: flex;
        align-items: center;
        padding: 0.4rem;
        user-select: none;
    }

    .catName {
        margin-left: 0.4rem;
        font-weight: 600;
    }
    
    .itm {
        padding: 0.4rem;
    }

    .catItm {
        display: flex;
        align-items: center;
        justify-content: right;
        padding: 0.4rem;
        cursor: pointer;
    }

    .catItm:hover {
        background-color: var(--highlightColor);
    }

    .catItmName {
        margin-right: 0.6rem;
    }

    .rightIco {
        font-size: 1.0rem;
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

    .noteContent {
        border-radius: 8px;
        background-color: var(--textfieldColor);
        padding: 0.5rem 0.75rem;
        margin: 0.75rem 0;
        color: var(--fontColor);
        line-height: 1.84rem;
        font-size: 1.15rem;
        /* width: fit-content; */
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

    .append {
        color: #3cb452;
    }

    .editing {
        color: #F5DF4D;
    }

    .readOnly {
        color: #BE3455;
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
