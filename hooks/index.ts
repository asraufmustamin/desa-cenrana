/**
 * Hooks Index
 * ===========
 * 
 * Export semua custom hooks dari satu tempat
 */

export { useKeyboardShortcuts, useKeyPress, ADMIN_SHORTCUTS } from "./useKeyboardShortcuts";
export {
    useDebounce, useLocalStorage, useOnClickOutside, useCopyToClipboard,
    useMediaQuery, useWindowSize, useIsOnline
} from "./useUtils";
export { useInfiniteScroll, useIntersectionObserver, usePagination } from "./useInfiniteScroll";
