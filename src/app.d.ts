
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
    viewCategoryId: number;
    viewOptionId: number;
}

interface CollectionSelection {
    id: number;
    name: string;
    note_count: number;
    last_open: string;
    favorite: boolean;
}

interface PositionedNote {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    position: number;
}

interface Positional {
    id: number;
    name: string;
    created_at: string;
    last_open: string;
}

interface Sortable {
    id: number;
    name: string;
    sort: SortType;
    ico: string;
}

interface ViewModeCategory {
    id: number;
    name: string;
    ico: string;
    options: Sortable[] | Positional[];
}






