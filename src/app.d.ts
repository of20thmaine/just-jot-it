interface Note {
    id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
}

interface Collection {
    id: number;
    notes: Note[];
    created_at: Date;
    updated_at: Date;
}
