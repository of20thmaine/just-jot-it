import Database, { type QueryResult } from "tauri-plugin-sql-api";

const db = await Database.load("sqlite:notes.db");

export async function CreateNote(content: string): Promise<QueryResult> {
    return await db.execute("INSERT INTO notes (content) VALUES ($1)", [content]);
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

// export async function GetCollection(): Promise<Collection> {
    
// }
