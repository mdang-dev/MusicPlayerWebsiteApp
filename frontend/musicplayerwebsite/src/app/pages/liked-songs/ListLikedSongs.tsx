import Main from "@/components/global/Main";
import {ScrollArea} from "@/components/ui/scroll-area";
import Spinner from "@/components/loading/Spinner";
import MusicCard from "@/components/sections/MusicCard";
import Footer from "@/components/global/Footer";
import React, {useEffect, useState} from "react";
import {Pause, Play, ThumbsUp} from "lucide-react";
import {useApp} from "@/app/Provider/AppContext";
import {redirect} from "next/navigation";
import useSWR from "swr";
import {Playlist} from "@/data/model/playlist.model";
import {useAudio} from "@/app/Provider/AudioContext";
import axios from "axios";
import {Song} from "@/data/model/song.model";
import {fetcher} from "@/app/Utils/Fetcher";
import SpinnerClient from "@/components/loading/SpinnerClient";

const ListLikedSongs = () => {

    const {user} = useApp();

    if (!user) redirect('/login-register');

    const {
        data: likedSongs = [],
        isLoading
    } = useSWR<Song[]>(`${process.env.NEXT_PUBLIC_API}/api/liked-songs/user-id/${user.userId}`, fetcher);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const {
        isPlaying,
        setIsPlaying,
        loadAudio,
        indexPlaying,
        togglePlayPauseAudio,
        audioReady,
        setSongData,
        repeat
    } = useAudio();


    useEffect(() => {
        if(user){
            axios.get(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user?.userId}`)
                .then(function (response){
                    setPlaylists(response.data);
                });
        }
    }, [user]);


    const handlePlayMusic = (song: Song) => {
        if (likedSongs) {
            if(repeat === 0 || song.songId !== indexPlaying){
                setSongData(likedSongs);
                loadAudio(song);
            }else {
                togglePlayPauseAudio();
            }
        }
    }


    const handlePlayLikedSongs = () => {
        if(likedSongs.length > 0){
            setIsPlaying((prev) => !prev);
            if (!audioReady.current?.src || !likedSongs.map((e) => e.songId).includes(indexPlaying)){
                if(likedSongs){
                    setSongData(likedSongs);
                    loadAudio(likedSongs[0]);
                }
            }
            else togglePlayPauseAudio();
        }
    }

    return (
        <>
                {
                    isLoading ? (
                        <div className={`w-full h-full relative`}>
                            <SpinnerClient className={`absolute pb-[9vh] pr-[12vh] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`}/>
                        </div>
                    ) : (
                        <div className={`ml-[1.9rem] flex gap-6 flex-wrap w-full`}>

                            <div className="w-full flex gap-[70px] mb-[20px]">

                                <div
                                    className="text-center w-max flex flex-col gap-5 my-auto place-items-center ml-6 relative">

                                    <div
                                        className="w-[250px] h-[250px] bg-gradient-to-r from-gray-500 to-gray-700 flex justify-center items-center rounded-lg mt-[40px]">
                                        <ThumbsUp className="text-black" size={200}/>
                                    </div>
                                    <div>
                                            <span
                                                className="text-white font-medium font-Righteous text-2xl">Yêu Thích</span>
                                    </div>
                                    <div>
                                        <span className="text-white font-medium">{likedSongs.length} bài hát</span>
                                    </div>
                                    <div
                                        className="absolute top-[50%] left-[50%] translate-x-[-50%] opacity-90 translate-y-[-60%] w-[60px] h-[60px] rounded-full bg-transparent outline outline-white flex justify-center items-center cursor-pointer">
                                        {isPlaying && likedSongs.map((e) => e.songId).includes(indexPlaying) ? (
                                            <Pause className={`opacity-90 mr-[1px] mt-1px`} size={40}
                                                   color={`white`} onClick={handlePlayLikedSongs}/>) : (
                                            <Play className={`opacity-90`} size={40} color={`white`}
                                                  onClick={handlePlayLikedSongs}/>)
                                        }
                                    </div>
                                </div>

                                <ScrollArea className={`h-[73vh] w-full`}>
                                    <div className="flex flex-wrap gap-x-6 gap-y-12 ml-[10px] my-4">
                                        {likedSongs.map(
                                            (song) => <MusicCard
                                                key={song.songId} song={song}
                                                isPlaying={isPlaying}
                                                indexPlaying={indexPlaying}
                                                playlists={playlists}
                                                handlePlayMusic={
                                                    () => handlePlayMusic(song)
                                                }
                                                songs={likedSongs}/>
                                        )}
                                    </div>
                                </ScrollArea>

                            </div>
                        </div>
                    )
                }
        </>
    )

}

export default ListLikedSongs;