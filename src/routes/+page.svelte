<script lang="ts">
    import { GetCollections } from "$lib/scripts/db";
    import { GetLastOpenCollection } from "$lib/scripts/settings";
    import { WindowTitle } from "$lib/scripts/stores";

    WindowTitle.set("Home");

    const DefaultView: CollectionView = {
        collectionId: 1, collectionName: "*", editModeId: 0, viewModeId: 0
    };

    let lastOpenView: CollectionView | null;
    let collections: CollectionSelection[];
    let currentSort: number = 4;

    GetLastOpenCollection().then((value) => lastOpenView = value as CollectionView | null);
    GetCollections().then(value => collections = value);

    function sortCollections(sortA: number, sortB: number) {
        if (currentSort === sortA || sortB) {
            currentSort === sortA ? currentSort = sortB : currentSort = sortA;
        } else {
            currentSort = sortA;
        }
        switch (currentSort) {
            case 0: collections.sort((a, b) => { // a-z
                return (a.name < b.name) ? -1 : 1;
            }); break;
            case 1: collections.sort((a, b) => { // z-a
                return (b.name < a.name) ? -1 : 1;
            }); break;
            case 2: collections.sort((a, b) => { // 1-9
                return (a.note_count < b.note_count) ? -1 : 1;
            }); break;
            case 3: collections.sort((a, b) => { // 9-1
                return (b.note_count < a.note_count) ? -1 : 1;
            }); break;
            case 4: collections.sort((a, b) => { // new-old
                return +new Date(b.last_modified) - +new Date(a.last_modified);
            }); break;
            case 5: collections.sort((a, b) => { // old-new
                return +new Date(a.last_modified) - +new Date(b.last_modified);
            }); break;
        }
        collections = collections;
    }
</script>

<div class="page">

    {#if collections}
        <div class="collections">
            <div class="row hrow">
                <div class="coH"
                        on:click={() => sortCollections(0, 1)}
                        on:keypress={() => sortCollections(0, 1)}>
                    <div class="cohTxt">Name</div>
                    {#if currentSort === 0}
                        <div class="cohIco"><i class="bi bi-caret-down-fill"></i></div>
                    {:else if currentSort === 1}
                        <div class="cohIco"><i class="bi bi-caret-up-fill"></i></div>
                    {/if}
                </div>
                <div class="coH"
                        on:click={() => sortCollections(2, 3)}
                        on:keypress={() => sortCollections(2, 3)}>
                    <div class="cohTxt">Notes</div>
                    {#if currentSort === 2}
                        <div class="cohIco"><i class="bi bi-caret-down-fill"></i></div>
                    {:else if currentSort === 3}
                        <div class="cohIco"><i class="bi bi-caret-up-fill"></i></div>
                    {/if}
                </div>
                <div class="coH"
                        on:click={() => sortCollections(4, 5)}
                        on:keypress={() => sortCollections(4, 5)}>
                    <div class="cohTxt">Last Modified</div>
                    {#if currentSort === 4}
                        <div class="cohIco"><i class="bi bi-caret-down-fill"></i></div>
                    {:else if currentSort === 5}
                        <div class="cohIco"><i class="bi bi-caret-up-fill"></i></div>
                    {/if}
                </div>
            </div>
            {#each collections as collection}
                <a href="{collection.id + "/" + collection.name + "/0/0"}">
                <div class="row itmR">
                    <div class="co">{collection.name}</div>
                    <div class="co">{collection.note_count}</div>
                    {#if +new Date() - +new Date(collection.last_modified) > (24*60*60*1000)}
                        <div class="co">{new Date(collection.last_modified).toLocaleDateString([], {year: "numeric", month: "short", day: "numeric"})}</div>
                    {:else}
                        <div class="co">{new Date(collection.last_modified).toLocaleTimeString([], {hour: "numeric", minute: "numeric", hour12: true})}</div>
                    {/if}
                </div>
                </a>
            {/each}
        </div>
    {/if}


    <!-- {#if lastOpenView}
        <div class="btnLbl">Last Open:</div>
        <a href="{lastOpenView.collectionId 
                + "/" + lastOpenView.collectionName + "/" 
                + lastOpenView.editModeId + "/" + lastOpenView.viewModeId}">
            <div class="lastOpen">
                <div class="collection">[Last Open]</div>
            </div>    
        </a>
    {/if}

    <div class="btnLbl">Default:</div>
    <a href="1/*/0/0">
        <div class="lastOpen">
            <div class="collection">[Default]</div>
        </div>    
    </a> -->

</div>

<style>
    .page {
        margin: 0 auto;
        margin-top: var(--titlebarHeight);
        max-width: 600px;
        padding: 1.0rem;
    }

    .row {
        display: grid;
        grid-template-columns: 1fr 100px 160px;
    }

    .hrow {
        margin: 0.25rem 0;
    }

    .coH {
        color: var(--fontColor);
        padding: 0.25rem;
        font-weight: 600;
        user-select: none;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .cohIco {
        margin-left: auto;
        margin-right: 1.0rem;
    }

    .co {
        color: var(--fontColor);
        padding-left: 1.25rem;
    }

    .itmR {
        border-bottom: 1px solid var(--titlebarColor);
        padding: 0.5rem 0;
    }

    .itmR:hover {
        background-color: var(--highlightColor);
    }


    a {
        text-decoration: none;
    }

</style>