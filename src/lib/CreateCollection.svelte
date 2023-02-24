<script lang="ts">
    import { onMount } from "svelte";
    import { CreateCollection } from "$lib/scripts/db";

    export let showCreateCollection: boolean;

    let input: HTMLElement;
    let collectionName: string = "";
    let errorString: string = "";

    onMount(() => setTimeout(() => {input.focus(), 0}));

    function keyHandler(event: KeyboardEvent): void {
        switch (event.key) {
            case "Enter":
                event.preventDefault();
                createCollection();
                return;
            case "Escape":
                showCreateCollection = !showCreateCollection;
                return;
        }
        if (errorString.length > 0) {errorString = ""}
    }

    function createCollection() {
        if (collectionName.length > 0) {
            if (collectionName.length > 36) {
                errorString = "Collection name cannot exceed 36 characters."
            } else {
                CreateCollection(collectionName)
                    .catch((reason) => {
                        console.log(reason);
                        errorString = "Collection name already exists.";
                    })
                    .then((onfulfilled) => {
                        if (onfulfilled) {
                            showCreateCollection = !showCreateCollection;
                        }
                    });
            }
        } else {
            errorString = "Collection cannot be created without a name."
        }
    }
</script>

<div class="modal"
        on:click={() => {showCreateCollection = !showCreateCollection}}
        on:keypress={() => {showCreateCollection = !showCreateCollection}}></div>
<div class="promptBox">
    <div class="closeBtn"
            on:click={() => {showCreateCollection = !showCreateCollection}}
            on:keypress={() => {showCreateCollection = !showCreateCollection}}>
        <i class="bi bi-x"></i></div>
    <div class="title">Create New Collection</div>
    <div class="noteInput"
        contenteditable="true"
        on:keydown={keyHandler}
        bind:this={input}
        bind:innerHTML={collectionName}
        placeholder="Enter collection name">
    </div>
    {#if errorString.length > 0}
        <div class="errorString">{errorString}</div>
    {/if}
    <div class="createBtn"
            on:click={() => createCollection()}
            on:keypress={() => createCollection()}>
        <i class="bi bi-plus"></i> Create</div>
</div>


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
        min-width: 340px;
    }

    .title {
        color: var(--fontColor);
        font-weight: 600;
        margin: 0.75rem 0 0 1.0rem;
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