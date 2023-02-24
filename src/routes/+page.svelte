<script lang="ts">
    import { WindowTitle } from "$lib/scripts/stores";

    WindowTitle.set("Home");
</script>

<div class="page">
    <div class="btnLbl">Last Open:</div>
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