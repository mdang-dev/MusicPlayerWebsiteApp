import {Artist} from "@/data/model/artist.model";
import {Genre} from "@/data/model/genre.model";

export type Song = {
    songId?: number;
    songName?: string;
    duration?: number;
    genre?: Genre;
    releaseDate?: Date;
    coverPhoto?: string;
    filePath?: string;
    artistSongs?: Artist[];
    plays?: number;
}