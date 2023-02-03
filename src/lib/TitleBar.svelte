<script lang="ts">
    import { appWindow } from '@tauri-apps/api/window';
    import { exit } from '@tauri-apps/api/process';
    import { onMount } from 'svelte';

    let isDarkMode: boolean;
    let darkPath = "dark_";
    let lightPath = "light_";
    let currentPath = "";

    let showFileMenu = false;

    $: isDarkMode ? currentPath = darkPath : currentPath = lightPath;

    onMount(() => {
        isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", () => {
            isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        });
    });
</script>

<div data-tauri-drag-region class="titlebar">
    <div class="icon">
        <img
            src="../tauri.svg"
            alt="Logo"
        />
    </div>
    <div class="menuSelection"
            on:click={() => {showFileMenu = !showFileMenu}}
            on:keypress={() => {showFileMenu = !showFileMenu}}>File</div>
        {#if showFileMenu}
            <div class="blinder"
                    on:click={() => {showFileMenu = !showFileMenu}}
                    on:keypress={() => {showFileMenu = !showFileMenu}}>
                <div class="dropdown">
                    <div class="dropdownItm">New note</div>
                    <div class="dropdownItm"
                            on:click={async () => {await exit(1)}}
                            on:keypress={async () => {await exit(1);}}>
                        Exit</div>
                </div>
            </div>
        {/if}
    <div class="titlebar-button" id="titlebar-minimize"
            on:click={() => {appWindow.minimize()}}
            on:keypress={() => {appWindow.minimize()}}>
        <img
            src="../img/{currentPath}window_btns/mdi_window-minimize.svg"
            alt="minimize"
        />
    </div>
    <div class="titlebar-button" id="titlebar-maximize"
            on:click={() => {appWindow.toggleMaximize()}}
            on:keypress={() => {appWindow.toggleMaximize()}}>
        <img
            src="../img/{currentPath}window_btns/mdi_window-maximize.svg"
            alt="maximize"
        />
    </div>
    <div class="titlebar-button" id="titlebar-close"
            on:click={() => {appWindow.close()}}
            on:keypress={() => {appWindow.close()}}>
        <img
            src="../img/{currentPath}window_btns/mdi_close.svg"
            alt="close"
        />
    </div>
</div>

<style>
    .titlebar {
        height: 30px;
        background-color: var(--titlebarColor);
        user-select: none;
        display: flex;
        justify-content: flex-end;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }

    .titlebar-button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
    }

    .titlebar-button:hover {
        background: var(--hoverBtnColor);
    }

    #titlebar-close:hover {
        background: red;
    }

    .menuSelection {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: auto;
        font-size: 0.9rem;
        color: var(--fontColor);
        padding: 0 0.5rem;
    }

    .menuSelection:hover {
        background-color: var(--hoverBtnColor);
    }

    .icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        margin: 0 0.6rem;
    }

    .icon img {
        height: 60%;
    }

    .blinder {
        position: fixed;
        z-index: 2;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .dropdown {
        position: relative;
        top: 30px;
        left: 2.5rem;
        background-color: var(--backgroundColor);
        border: 1px solid var(--borderColor);
        border-radius: 4px;
        width: 180px;
        padding: 0.15rem;
    }

    .dropdownItm {
        color: var(--fontColor);
        padding: 0.4rem 1.0rem;
        border-radius: 4px;
    }

    .dropdownItm:hover {
        background-color: var(--highlightColor);
    }
</style>
