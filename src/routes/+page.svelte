<script lang="ts">
    import { GetCollections, GetFavorites, ToggleCollectionFavorite } from "$lib/scripts/db";
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

<div class="page">

    <!-- {#if lastOpenView}
        <div class="header">Last Open</div>
        <a href="{lastOpenView.collectionId + "/" + lastOpenView.collectionName +
                "/" + lastOpenView.editModeId + "/" + lastOpenView.viewModeId}">
            <div class="row">
                <div class="co"></div>
            </div>
        </a>
    {/if} -->

    {#if favorites && favorites.length > 0}
        <div class="header">Favorites</div>
        <CollectionsTable bind:collections={favorites} updateCollections={updateCollections} />
    {/if}

    {#if collections}
        <div class="header">Collections</div>
        <CollectionsTable bind:collections={collections} updateCollections={updateCollections} />
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

    .header {
        color: var(--fontColor);
        font-size: 1.5rem;
        border-bottom: 1px solid;
        margin: 1.0rem 0;
        padding: 0.5rem;
    }
</style>