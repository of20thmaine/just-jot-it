<script lang="ts">
    import { CreateNote, GetCollectionList } from "$lib/scripts/db";
    import { GetDefaultCollection } from "$lib/scripts/settings";

    export let showQuickNote: boolean;

    let collections: Collection[];
    let input: HTMLElement;
    let note: string = "";
    let showCollectionSelect: boolean = false;
    let selectedCollection: Collection;
    let errorString: string = "";

    $: if (input) input.focus();

    async function getData() {
        return Promise.all([GetCollectionList(), GetDefaultCollection()])
            .then((value) => {
                collections = value[0];
                let defaultId = value[1];
                if (!defaultId) { defaultId = 1 }

                for (let collection of collections) {
                    if (collection.id === defaultId) {
                        selectedCollection = collection;
                        return;
                    }
                }
            });
    }

    function keyHandler(event: KeyboardEvent): void {
        switch (event.key) {
            case "Enter":
                event.preventDefault();
                createNote();
                return;
            case "Escape":
                event.preventDefault();
                showQuickNote = !showQuickNote;
                return;
        }
    }

    function createNote() {
        if (note.length > 0) {
            CreateNote(note, selectedCollection.id)
                .then(() => note = "");
        }
    }
</script>

{#await getData() then x}
<div class="modal"
        on:click={() => {showQuickNote = !showQuickNote}}
        on:keypress={() => {showQuickNote = !showQuickNote}}></div>
<div class="promptBox">
    <div class="closeBtn"
            on:click={() => {showQuickNote = !showQuickNote}}
            on:keypress={() => {showQuickNote = !showQuickNote}}>
        <i class="bi bi-x"></i></div>
    <div class="title">Quick Note</div>
    <div class="collectionPrompt">
        <i class="bi bi-arrow-return-right"></i>
        <div class="selector"
                on:click={() => {showCollectionSelect = !showCollectionSelect}}
                on:keypress={() => {showCollectionSelect = !showCollectionSelect}}>
            <div class="selected">{selectedCollection.name}</div>
            <i class="bi bi-chevron-down rI"></i>
        </div>
    </div>
    {#if showCollectionSelect}
        <div class="blinder"
            on:click={() => {showCollectionSelect = !showCollectionSelect}}
            on:keypress={() => {showCollectionSelect = !showCollectionSelect}}></div>
        <div class="selectorMenu">
        {#each collections as collection}
            <div class="opt"
                    on:click={() => {
                        selectedCollection = collection;
                        showCollectionSelect = !showCollectionSelect;
                    }}
                    on:keypress={() => {
                        selectedCollection = collection;
                        showCollectionSelect = !showCollectionSelect;
                    }}>
                {collection.name}</div>
        {/each}
        </div>
    {/if}
    <div class="noteInput"
        contenteditable="true"
        on:keydown={keyHandler}
        bind:this={input}
        bind:innerHTML={note}
        placeholder="Create new note">
    </div>
    {#if errorString.length > 0}
        <div class="errorString">{errorString}</div>
    {/if}
    <div class="createBtn"
            on:click={() => createNote()}
            on:keypress={() => createNote()}>
        <i class="bi bi-plus"></i> Create</div>
</div>
{/await}

<style>
    .modal {
        position: absolute;
        z-index: 2;
        top: var(--titlebarHeight);
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .promptBox {
        margin: 0;
        position: absolute;
        z-index: 3;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--backgroundColor);
        border: 1px solid var(--hoverBtnColor);
        width: 400px;
    }

    .title {
        color: var(--fontColor);
        font-weight: 600;
        margin: 0.75rem 0 0 1.0rem;
    }

    .collectionPrompt {
        color: var(--fontColor);
        display: flex;
        align-items: center;
        margin: 0.5rem 0 0 1.25rem;
    }

    .selector {
        display: flex;
        align-items: center;
        background-color: var(--textfieldColor);
        cursor: pointer;
        user-select: none;
        font-size: 0.95rem;
        padding: 0.25rem 1.0rem;
        width: 240px;
        margin-left: 0.5rem;
        border: 1px solid var(--borderColor);
        border-radius: 4px;
    }

    .selectorMenu {
        position: fixed;
        z-index: 3;
        color: var(--fontColor);
        width: 240px;
        border: 1px solid;
        background-color: var(--textfieldColor);
        left: 2.75rem;
        cursor: pointer;
        user-select: none;
        font-size: 0.95rem;
    }

    .opt {
        padding: 0.4rem 1.0rem;
    }

    .opt:hover {
        background-color: var(--highlightColor);
    }

    .rI {
        margin-left: auto;
    }

    .closeBtn {
        position: fixed;
        top: 0.3rem;
        right: 0.3rem;
        color: var(--fontColor);
        font-size: 1.25rem;
        cursor: pointer;
    }

    .closeBtn:hover {
        color: red;
    }

    .noteInput {
        border-radius: 4px;
        background-color: var(--textfieldColor);
        padding: 0.5rem;
        color: var(--fontColor);
        margin: 1.0rem 0.75rem 1.0rem 0.75rem;
        line-height: 1.84rem;
        min-height: 5.52rem;
        font-size: 1.15rem;
    }

    [contenteditable=true]:empty:before {
        content:attr(placeholder);
        color: grey;
    }

    .errorString {
        color: #BE3455;
        font-size: 0.9rem;
        margin: -0.5rem 1.0rem 0.5rem 1.0rem;
    }

    .createBtn {
        color: white;
        background-color: #238636;
        width: fit-content;
        text-align: center;
        padding: 0.25rem 1.0rem;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        float: right;
        margin: 0 0.75rem 0.75rem 0;
        cursor: pointer;
    }

    .createBtn:hover {
        background-color: #196127;
    }
</style>
