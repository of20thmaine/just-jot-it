<script lang="ts">
    import { EditModes } from "$lib/scripts/db";

    export let editMode: any;
    export let viewMode: any;
    export let changeEditMode: (modeSelection: number) => void;
    export let changeViewMode: (modeSelection: number) => void;

    let showEditModeSelect = false;
    let showViewModeSelect = false;

    function toggleShowEditMode() {
        showEditModeSelect = !showEditModeSelect;
    }

    function toggleShowViewMode() {
        showViewModeSelect = !showViewModeSelect;
    }
</script>

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
                        on:click={() => {
                            changeEditMode(mode.id);
                            showEditModeSelect = false;
                        }}
                        on:keypress={() => {
                            changeEditMode(mode.id);
                            showEditModeSelect = false;
                        }}>
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
                        on:click={() => {
                            changeViewMode(0);
                            showViewModeSelect = false;
                        }}
                        on:keypress={() => {
                            changeViewMode(0);
                            showViewModeSelect = false;
                        }}>
                    <div class="catItmName">Old to New</div>
                    <i class="bi bi-sort-numeric-down-alt"></i>
                </div>
                <div class="catItm"
                        on:click={() => {
                            changeViewMode(1);
                            showViewModeSelect = false;
                        }}
                        on:keypress={() => {
                            changeViewMode(1);
                            showViewModeSelect = false;
                        }}>
                    <div class="catItmName">New to Old</div>
                    <i class="bi bi-sort-numeric-down"></i>
                </div>
            <div class="cat">
                <i class="bi bi-arrow-down-up"></i>
                <div class="catName">Date Modified:</div>
            </div>
                <div class="catItm"
                        on:click={() => {
                            changeViewMode(2);
                            showViewModeSelect = false;
                        }}
                        on:keypress={() => {
                            changeViewMode(2);
                            showViewModeSelect = false;
                        }}>
                    <div class="catItmName">Old to New</div>
                    <i class="bi bi-sort-numeric-down-alt"></i>
                </div>
                <div class="catItm"
                        on:click={() => {
                            changeViewMode(3);
                            showViewModeSelect = false;
                        }}
                        on:keypress={() => {
                            changeViewMode(3);
                            showViewModeSelect = false;
                        }}>
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

<style>
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

    .append {
        color: #3cb452;
    }

    .editing {
        color: #F5DF4D;
    }

    .readOnly {
        color: #BE3455;
    }
</style>
