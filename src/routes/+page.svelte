<script lang="ts">
    import { GetCollections, GetFavorites } from "$lib/scripts/db";
    import { GetLastOpenCollection } from "$lib/scripts/settings";
    import { WindowTitle } from "$lib/scripts/stores";
    import CollectionsTable from "$lib/CollectionsTable.svelte";

    WindowTitle.set("Home");

    const DefaultView: CollectionView = {
        collectionId: 1, collectionName: "*", editModeId: 0, viewModeId: 0
    };

    let lastOpenView: CollectionView | null;
    let collections: CollectionSelection[];
    let favorites: CollectionSelection[];

    GetLastOpenCollection().then((value) => lastOpenView = value as CollectionView | null);

    updateCollections();

    async function updateCollections(): Promise<void> {
        return Promise.all([GetFavorites(), GetCollections()])
            .then((value) => {
                favorites = value[0];
                collections = value[1];
            });
    }
</script>
<div class="scroller">
<div class="page">
    <div class="pageTop">
        <div class="lastOpen">
            {#if lastOpenView}
                <div class="header">Last Open</div>
                <a href="{lastOpenView.collectionId + "/" + lastOpenView.collectionName +
                        "/" + lastOpenView.editModeId + "/" + lastOpenView.viewModeId}">
                    <div class="lastOpenCollection"><i class="bi bi-arrow-return-right"></i> {lastOpenView.collectionName}</div>
                </a>
            {:else}
                <a href="1/*/0/0">
                    <div class="default">
                        <div class="collection">[Default]</div>
                    </div>    
                </a>
            {/if}
        </div>
        <div class="btnGroup">
            <a href="quicknote"><div class="homeBtn quicknote"><i class="bi bi-pencil-square"></i> Quick Note</div></a>
            <a href="quicknote"><div class="homeBtn createcoll"><i class="bi bi-plus-lg"></i> Create Collection</div></a>
        </div>
    </div>

    {#if favorites && favorites.length > 0}
        <div class="header">Favorites</div>
        <CollectionsTable bind:collections={favorites} updateCollections={updateCollections} />
    {/if}

    {#if collections}
        <div class="header">Collections</div>
        <CollectionsTable bind:collections={collections} updateCollections={updateCollections} />
    {/if}
</div>
</div>

<style>
    .scroller {
        margin-top: var(--titlebarHeight);
        height: calc(100vh - var(--titlebarHeight));
        overflow-y: auto;
    }

    .page {
        margin: 0 auto;
        max-width: 600px;
        padding: 1.0rem;
        overflow-y: auto;
    }

    .pageTop {
        display: grid;
        grid-template-columns: 1fr 240px;
        column-gap: 1.0rem;
        margin-bottom: 1.0rem;
    }

    .header {
        color: var(--fontColor);
        font-size: 1.5rem;
        border-bottom: 1px solid;
        margin-bottom: 1.0rem;
        padding: 0.5rem;
    }

    .lastOpenCollection {
        color: var(--fontColor);
        font-size: 1.15rem;
    }

    .homeBtn {
        font-size: 1.2rem;
        text-align: center;
        width: 100%;
        padding: 0.5rem 0;
        border: 1px solid;
        border-radius: 4px;
        margin-top: 1.0rem;
    }

    .quicknote {
        color: #6667ab;
    }

    .createcoll {
        color: #34be7b;
    }

    a {
        text-decoration: none;
    }
</style>