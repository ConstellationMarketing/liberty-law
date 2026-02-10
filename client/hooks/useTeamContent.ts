// Cache for team content
let cachedTeamContent: any | null = null;

// Helper to clear cache (useful after admin edits)
export function clearTeamContentCache() {
  cachedTeamContent = null;
}
