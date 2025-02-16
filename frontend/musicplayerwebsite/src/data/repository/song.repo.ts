export type Song = {
    songId?: number;
    songName?: string;
    duration?: number;
    genreName?: string;
    releaseDate?: Date;
    coverPhoto?: string;
    filePath?: string;
    artistName?: string;
    plays: number;
}