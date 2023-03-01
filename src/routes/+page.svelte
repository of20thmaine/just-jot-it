<script lang="ts">
    import { GetLastOpenCollection, SetLastOpenCollection } from "$lib/scripts/settings";
    import { WindowTitle } from "$lib/scripts/stores";

    WindowTitle.set("Home");

    const DefaultView: CollectionView = {
        collectionId: 1, collectionName: "*", editModeId: 0, viewModeId: 0
    };

    let lastOpenView: CollectionView | null;

    GetLastOpenCollection().then((value) => lastOpenView = value as CollectionView | null);

</script>

<div class="page">

    {#if lastOpenView}
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
    </a>

</div>

<style>
    .page {
        margin: 0 auto;
        margin-top: var(--titlebarHeight);
        max-width: 600px;
    }

    .btnLbl {
        color: var(--fontColor);
    }

    .lastOpen {
        color: purple;
        border: 2px solid purple;
        border-radius: 8px;
        padding: 1.0rem;
        width: fit-content;
    }

    .collection {
        font-size: 2.0rem;
    }

    a {
        text-decoration: none;
    }

</style>