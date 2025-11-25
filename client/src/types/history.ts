export interface HistoryItem {
  id: number;
  artistId: string;
  artistName: string;
  artistAvatar?: string | null;
  searchedAt: string;
}
