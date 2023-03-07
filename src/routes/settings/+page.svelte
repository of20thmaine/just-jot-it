<script lang="ts">
    import { SetColorModeIsDark } from "$lib/scripts/settings";
    import { ColorModeIsDark, WindowTitle } from "$lib/scripts/stores";

    WindowTitle.set("Settings");

    let showColorThemeSelect: boolean = false;
    let colorThemePrompt: string = "";

    function setColorTheme(makeDarkMode: boolean) {
        SetColorModeIsDark(makeDarkMode);
        ColorModeIsDark.set(makeDarkMode);
    }

    ColorModeIsDark.subscribe((value) => {
        if (value) {
            colorThemePrompt = "Dark Mode";
        } else {
            colorThemePrompt = "Light Mode";
        }
    });
</script>

<div class="scroller">
    <div class="page">
        <h1>Settings</h1>
        <h3>Color Mode:</h3>
        <div class="selector" class:selectorSelected={showColorThemeSelect}
                on:click={() => {showColorThemeSelect = !showColorThemeSelect}}
                on:keypress={() => {showColorThemeSelect = !showColorThemeSelect}}>
            <div class="selected">{colorThemePrompt}</div>
            <i class="bi bi-chevron-down rI"></i>
        </div>
        {#if showColorThemeSelect}
            <div class="blinder"
                on:click={() => {showColorThemeSelect = !showColorThemeSelect}}
                on:keypress={() => {showColorThemeSelect = !showColorThemeSelect}}></div>
            <div class="selectorMenu">
                <div class="opt"
                        on:click={() => {
                            setColorTheme(true);
                            showColorThemeSelect = !showColorThemeSelect;
                        }}
                        on:keypress={() => {
                            setColorTheme(true);
                            showColorThemeSelect = !showColorThemeSelect;
                        }}>
                    Dark Mode</div>
                <div class="opt"
                        on:click={() => {
                            setColorTheme(false);
                            showColorThemeSelect = !showColorThemeSelect;
                        }}
                        on:keypress={() => {
                            setColorTheme(false);
                            showColorThemeSelect = !showColorThemeSelect;
                        }}>
                    Light Mode</div>
            </div>
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
        color: var(--fontColor);
    }

    h1 {
        font-size: 1.5rem;
        border-bottom: 1px solid;
        margin-bottom: 1.0rem;
        padding: 0.5rem;
    }

    h3 {
        font-size: 1.15rem;
        margin-bottom: 0.5rem;
    }

    .selector {
        display: flex;
        align-items: center;
        background-color: var(--textfieldColor);
        cursor: pointer;
        user-select: none;
        padding: 0.5rem 1.0rem 0.5rem 0.5rem;
        width: 220px;
        border: 1px solid transparent;
        border-radius: 4px;
    }

    .selectorSelected {
        border: 1px solid var(--fontColor);
        background-color: var(--fontColor);
        color: var(--textfieldColor);
    }

    .selectorMenu {
        position: fixed;
        margin-top: -4px;
        z-index: 3;
        color: var(--fontColor);
        width: 220px;
        border-right: 1px solid;
        border-bottom: 1px solid;
        border-left: 1px solid;
        background-color: var(--textfieldColor);
        cursor: pointer;
        user-select: none;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .opt {
        padding: 0.5rem 1.0rem 0.5rem 0.5rem;
    }

    .opt:hover {
        background-color: var(--highlightColor);
    }

    .rI {
        margin-left: auto;
    }
</style>
