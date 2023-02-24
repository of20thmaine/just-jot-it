interface Note {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
}

interface Collection {
    id: number;
    notes: Note[];
    created_at: string;
    updated_at: string;
}

interface CollectionView {
    collectionId: number;
    collectionName: string;
    editModeId: number;
    viewModeId: number;
}
