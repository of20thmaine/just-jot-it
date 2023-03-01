import { Store } from "tauri-plugin-store-api";

const store = new Store(".settings.dat");

export async function SetLastOpenCollection(collection: CollectionView) {
    store.set("last-open-collection", collection);
}

export async function GetLastOpenCollection() {
    return store.get("last-open-collection");
}

export async function SetDefaultCollection(collectionId: number) {
    store.set("default-collection", collectionId);
}

export async function GetDefaultCollection() {
    return store.get("default-collection");
}
