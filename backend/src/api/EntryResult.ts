import { Entry } from "../database/Entry";

export type EntryResult = {
    entries: Entry[]
    page: number
    pages: number
}