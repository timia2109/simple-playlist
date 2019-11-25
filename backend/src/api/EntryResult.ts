import { Entry } from "../database/Entry";

export type EntryResult = {
    entries: Entry[]
    offset: number,
    items: number,
    size: number,
}