/**
 * Re-export types dari AppContext untuk kemudahan import
 * File ini dibuat untuk modularitas tanpa mengubah AppContext.tsx
 */

// Re-export all types from AppContext
export type {
    NewsItem,
    LapakItem,
    AspirasiItem,
    Official,
    Program,
    GalleryItem,
    InfografisData,
    HukumItem,
    AgendaItem,
    WASubscriber,
    CMSContent,
    KepalaDesaStatus,
} from "./AppContext";

// Usage: import { NewsItem, LapakItem } from "@/context/types"
// atau tetap bisa: import { NewsItem } from "@/context/AppContext"
