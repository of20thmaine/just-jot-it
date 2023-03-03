interface Note {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
}

interface Collection {
    id: number;
    name: string;
}

interface CollectionView {
    collectionId: number;
    collectionName: string;
    editModeId: number;
    viewModeId: number;
}

interface CollectionSelection {
    id: number;
    name: string;
    note_count: number;
    last_modified: string;
}
