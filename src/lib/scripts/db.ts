import Database, { type QueryResult } from "tauri-plugin-sql-api";

const db = await Database.load("sqlite:notes.db");

export async function CreateNote(content: string, collection_id: number): Promise<QueryResult> {
    return await db.execute(
        "INSERT INTO notes (content, collection_id) VALUES ($1, $2)",
        [content, collection_id]
    );
}

export async function CreateCollection(name: string): Promise<QueryResult> {
    return await db.execute(
        "INSERT INTO collections (name) VALUES ($1)",
        [name]
    );
}

export async function UpdateNote(id: number, content: string): Promise<QueryResult> {
    return await db.execute("UPDATE notes SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [content, id]);
}

export async function DeleteNote(id: number): Promise<QueryResult> {
    return await db.execute("DELETE FROM notes WHERE id = $1", [id]);
}

export async function GetAllNotes(): Promise<Note[]> {
    return await db.select("SELECT * FROM notes");
}

export async function GetCollection(collection_id: number, sort: SortTypes): Promise<Note[]> {
    return await db.select("SELECT * FROM notes WHERE collection_id = $1 ORDER BY $2",
        [collection_id, getOrderByStr(sort)]);
}

// export async function GetCollectionName(id: number): Promise<string> {
//     return await db.select("SELECT name FROM collections WHERE id = $1", [id]);
// }

// export async function GetCollectionTwo(collection_id: number, sort: SortTypes): Promise<Collection> {

// }

// export async function addSomeData() {
//     await db.execute("INSERT INTO collections (name) VALUES ('*')");
//     await db.execute("INSERT INTO notes (content, collection_id) VALUES ('Example Note One.', 1)");
//     await db.execute("INSERT INTO notes (content, collection_id) VALUES ('Example Note Two.', 1)");
//     await db.execute("INSERT INTO notes (content, collection_id) VALUES ('Example Note Three.', 1)");
// }

function getOrderByStr(sortType: SortTypes): string {
    switch (sortType) {
        case SortTypes.Date_Added_Asc:
            return "created_at ASC";
        case SortTypes.Date_Added_Dsc:
            return "created_at DSC";
        case SortTypes.Date_Modified_Asc:
            return "updated_at ASC";
        case SortTypes.Date_Modified_Dsc:
            return "updated_at DSC";
    }
}

export enum SortTypes {
    Date_Added_Asc,
    Date_Added_Dsc,
    Date_Modified_Asc,
    Date_Modified_Dsc
}

export const EditModes = [
    {id: 0, name: 'Append', class: 'append', icoClass: 'bi bi-plus'},
    {id: 1, name: 'Free-Edit', class: 'editing', icoClass: 'bi bi-pen tIco'},
    {id: 2, name: 'Read-Only', class: 'readOnly', icoClass: 'bi bi-lock sIco'}
];

export const ViewModes = [
    {id: 0, type: SortTypes.Date_Added_Asc, name: "Date Added", leftIco: "bi bi-arrow-down-up",
        rightIco: "bi bi-sort-numeric-down-alt"},
    {id: 1, type: SortTypes.Date_Added_Dsc, name: "Date Added", leftIco: "bi bi-arrow-down-up",
        rightIco: "bi bi-sort-numeric-down"},
    {id: 2, type: SortTypes.Date_Modified_Asc, name: "Date Modified", leftIco: "bi bi-arrow-down-up",
        rightIco: "bi bi-sort-numeric-down-alt"},
    {id: 3, type: SortTypes.Date_Modified_Dsc, name: "Date Modified", leftIco: "bi bi-arrow-down-up",
        rightIco: "bi bi-sort-numeric-down"},
];
