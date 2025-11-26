# Homepage Polish Implementation Plan

## Goal
Final polish of `app/page.tsx` to address specific UI bugs and client requests regarding the Hero section, Stats card, SOTK slideshow, and global dark mode/animations.

## User Review Required
> [!IMPORTANT]
> The "Dana Desa" card will have a special layout spanning 2 columns. This assumes the grid layout can accommodate it without breaking the flow of other cards.

## Proposed Changes

### Homepage (`app/page.tsx`)

#### [MODIFY] [page.tsx](file:///c:/Users/Asus/.gemini/antigravity/scratch/desa-cenrana/app/page.tsx)
- **Hero Section**:
    - Update "Profil Desa" button to use `bg-gradient-to-r from-orange-500 to-yellow-500`.
    - Ensure dark overlay `bg-black/60` is correctly applied.
- **Stats Section**:
    - Implement `CountUp` animation for numbers.
    - Adjust grid to `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` (or similar) to allow spanning.
    - Add logic: if label contains "Dana Desa", add `col-span-2` and increase font size.
- **SOTK (Officials) Section**:
    - Change container to `flex flex-row overflow-x-auto snap-x ...`.
    - Ensure items are `min-w-[220px]`.
    - Add fallback dummy data if officials list is empty.
- **Global**:
    - Update root container classes for dark mode.
    - Add entry animations (`animate-in fade-in slide-in-from-bottom-4`).

## Verification Plan
### Automated Tests
- Run `npm run build` to ensure no TypeScript errors.
- (Agent) Verify code structure matches requirements.

### Manual Verification
- Check "Profil Desa" button gradient.
- Check "Dana Desa" card size and animation.
- Check SOTK carousel scrolling and fallback.
- Check Dark Mode colors.
