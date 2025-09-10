export function extractDateFromSlug(slug: string): Date {
    // Extract date from slug format: YYYY-MM-DD-title
    const match = slug.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (match) {
        return new Date(match[1]);
    }
    // Fallback to current date if no date pattern found
    return new Date();
}
