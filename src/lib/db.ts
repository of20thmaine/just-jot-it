import Database, { type QueryResult } from "tauri-plugin-sql-api";

const db = await Database.load("sqlite:notes.db");

export async function CreateNote(content: string, collection_id: number): Promise<QueryResult> {
    return await db.execute(
        "INSERT INTO notes (content, collection_id) VALUES ($1, $2)",
        [content, collection_id]
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

export async function addSomeData() {
    await db.execute("INSERT INTO collections (name) VALUES ('*')");
    await db.execute("INSERT INTO notes (content, collection_id) VALUES ('Example Note One.', 1)");
    await db.execute("INSERT INTO notes (content, collection_id) VALUES ('Example Note Two.', 1)");
    await db.execute("INSERT INTO notes (content, collection_id) VALUES ('Example Note Three.', 1)");
}
