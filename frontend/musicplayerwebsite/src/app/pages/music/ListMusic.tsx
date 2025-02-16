import {useApp} from "@/app/Provider/AppContext";
import {useAudio} from "@/app/Provider/AudioContext";
import React, {useEffect, useState} from "react";
import {Playlist} from "@/data/model/playlist.model";
import {Song} from "@/data/model/song.model";
import useSWR from "swr";
import {fetcher} from "@/app/Utils/Fetcher";
import {useSearchParams} from "next/navigation";
import axios from "axios";
import MusicCard from "@/components/sections/MusicCard";
import {ScrollArea} from "@/components/ui/scroll-area";
import Main from "@/components/global/Main";
import Footer from "@/components/global/Footer";
import SpinnerClient from "@/components/loading/SpinnerClient";

const ListMusic = () => {

    const {user} = useApp();
    const {setSongData} = useAudio();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const {data, isLoading} = useSWR<Song[]>(`${process.env.NEXT_PUBLIC_API}/api/songs`, fetcher);

    const searchParams = useSearchParams();
    const search = searchParams.get('search')

    useEffect(() => {
        if (search) {
            const filteredSongs = songs.filter((song) =>
                song.songName!.toUpperCase().indexOf(search.toUpperCase()) !== -1 || (song.artistSongs as unknown as {
                    artist: { artistName: string }
                }[]).map((e) => (e.artist.artistName)).join(', ').toUpperCase().includes(search.toUpperCase()));
            setSongs(filteredSongs);
        } else {
            if (data) {
                setSongs(data);
            }
        }
    }, [search]);

    useEffect(() => {
        if (data) {
            setSongs(data);
        }
    }, [data]);

    const {
        isPlaying,
        loadAudio,
        indexPlaying,
        repeat,
        togglePlayPauseAudio
    } = useAudio();

    useEffect(() => {
        if (user) {
            axios.get(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user?.userId}`)
                .then(function (response) {
                    setPlaylists(response.data);
                });
        }
    }, [user]);

    const handlePlayMusic = (song: Song) => {
        if (songs) {
            if(repeat === 0 || song.songId !== indexPlaying){
                setSongData(songs);
                loadAudio(song);
            }else {
                togglePlayPauseAudio();
            }
        }
    }


    return (

        <ScrollArea className={`hide-scrollbar w-full`}>
            {
                isLoading ? (
                    <div className={`w-full h-full relative`}>
                        <SpinnerClient
                            className={`absolute pb-[9vh] pr-[12vh] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`}/>
                    </div>
                ) : (
                    search ? (
                        <div className={`ml-[1.5rem] flex gap-6 flex-wrap w-full`}>
                            {songs.reverse().map((song) => <MusicCard
                                key={song.songId}
                                song={song}
                                isPlaying={isPlaying}
                                indexPlaying={indexPlaying}
                                playlists={playlists}
                                handlePlayMusic={
                                    () => handlePlayMusic(song)
                                }/>)
                            }
                        </div>
                    ) : (
                        <div className={`ml-[1.5rem] flex gap-6 flex-wrap w-full`}>
                            {songs.map((song) =>
                                <MusicCard
                                    key={song.songId} song={song}
                                    isPlaying={isPlaying}
                                    indexPlaying={indexPlaying}
                                    playlists={playlists}
                                    handlePlayMusic={
                                        () => handlePlayMusic(song)
                                    }/>)
                            }
                        </div>

                    )
                )
            }
        </ScrollArea>

    )

}

export default ListMusic;