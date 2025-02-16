"use client"

import {Song} from "@/data/model/song.model";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    Play,
    Ellipsis,
    CirclePlus,
    ListPlus,
    ChevronRight, Trash, Clock
} from "lucide-react";
import {Playlist} from "@/data/model/playlist.model";
import PlaylistCard from "@/components/sections/PlaylistCard";
import React from "react";
import {usePathname} from "next/navigation";
import {useApp} from "@/app/Provider/AppContext";
import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "@/components/hooks/use-toast";
import {mutate} from "swr";
import SoundLoading from "@/components/loading/SoundLoading";


type Props = {
    song: Song;
    isPlaying: boolean;
    playlists?: Playlist[] | null;
    handlePlayMusic: () => void;
    indexPlaying: number | null;
    songs?: Song[]
    playlistId?: string;
}

const MusicCard: React.FC<Props> = ({
                                        song,
                                        isPlaying,
                                        playlists,
                                        handlePlayMusic,
                                        indexPlaying,
                                        songs,
                                        playlistId
                                    }) => {


    const path = usePathname();

    const getDistanceToRight = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        return screenWidth - rect.right;
    }

    const handleOnMouseOverPlaylist = (e: React.MouseEvent<SVGSVGElement>) => {

        const parentElement = e.currentTarget.closest('.ct-section-card') as HTMLElement;
        const allOptions = parentElement.querySelector('.all-options') as HTMLElement;
        const allPlaylist = parentElement.querySelector('.all-playlists') as HTMLElement;
        const playlistItem = parentElement.querySelector('.playlist-item') as HTMLElement;

        const elementsEvent: HTMLElement[] = [
            allOptions,
            allPlaylist,
            playlistItem
        ];

        if (getDistanceToRight(parentElement) < 400) {
            const cardAllOptions = allOptions.querySelector('.card-all-options')! as HTMLElement;
            cardAllOptions.classList.replace('translate-x-[-2px]', 'translate-x-[-190px]');
            playlistItem.classList.replace('translate-x-44', 'translate-x-[-178px]');
        }

        elementsEvent.map((element) => {
            element.onmouseover = () => element.classList.replace('hidden', 'block');
            element.onmouseout = () => element.classList.replace('block', 'hidden');
        });

        allOptions.classList.replace('hidden', 'block');
        allPlaylist.onmouseover = () => {
            playlistItem.classList.replace('hidden', 'block');
        }
        allPlaylist.onmouseout = () => {
            playlistItem.classList.replace('block', 'hidden');
        }

    }

    const handleOnMouseOutPlaylist = (e: React.MouseEvent<SVGSVGElement>) => {

        const parentElement = e.currentTarget.closest('.ct-section-card') as HTMLElement;
        const allOptions = parentElement.querySelector('.all-options') as HTMLElement;
        const allPlaylist = parentElement.querySelector('.all-playlists') as HTMLElement;
        const playlistItem = parentElement.querySelector('.playlist-item') as HTMLElement;

        const elementsEvent: HTMLElement[] = [
            allOptions,
            allPlaylist,
            playlistItem
        ];
        elementsEvent.map((element) => element.classList.replace('block', 'hidden'));
    }

    const {user} = useApp();

    const handleInsertSong = (songId: number) => {
        if (user) {
            axios.post(`${process.env.NEXT_PUBLIC_API}/api/liked-songs`, {
                userId: user.userId,
                songId: songId,
            }).then(async function (response: AxiosResponse) {
                if (response.status !== 200) throw new Error('Error insert data from server !');
                toast({
                    description: response.data.message,
                })
            }).catch(function (err: AxiosError) {
                console.log(err);
            })
        }
    }


    const handleRemoveLiked = (songId: number, songs: Song[]) => {
        if (user) {
            axios.delete(`${process.env.NEXT_PUBLIC_API}/api/liked-songs`, {
                data: {
                    userId: user.userId,
                    songId: songId
                }
            }).then(async function (response: AxiosResponse) {
                if (response.status !== 200) throw new Error('Error delete data from server !');
                toast({
                    description: response.data.message,
                })
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/liked-songs/user-id/${user.userId}`,
                    (songs).filter((s) => s.songId !== songId),
                    false);
            }).catch(function (err: AxiosError) {
                console.log(err);
            })
        }
    }

    const handleRemoveSongInPlaylist = (songId: number) => {
        if(playlistId) {
            axios.delete(`${process.env.NEXT_PUBLIC_API}/api/playlists-songs`, {
                data: {
                    playlistId: playlistId,
                    songId: song.songId
                }
            }).then(async function (response: AxiosResponse) {
                if (response.status !== 200) throw new Error('Error delete data from server !');
                toast({
                    description: response.data.message,
                })
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/playlists-songs/id/${playlistId}`,
                    (songs!).filter((s) => s.songId !== songId),
                    false);
            }).catch(function (err: AxiosError) {
                console.log(err);
            })
        }
    }

    return (
        <section className="ct-section-card group opacity-100">
            <div className="relative grid place-items-start z-2">
                <img src={`${process.env.NEXT_PUBLIC_API}${song.coverPhoto}`}
                     className="w-full h-[100px] object-cover object-center"/>
                <div className={indexPlaying === song.songId ? `ct-play-music-start` : `ct-play-music`}
                     onClick={handlePlayMusic}>
                    {isPlaying && indexPlaying == song.songId ? (<SoundLoading className={`boxContainer`}/>) : (<Play fill={`full`} color={`black`}/>)}
                </div>
            </div>
            <div className="mt-1">
                <h3 className="font-Roboto text-white font-medium text-[14px] truncate m-1">{song.songName}</h3>
                <h5
                    className="font-Roboto text-[#b1b1b1] font-medium text-[10px] truncate m-1">
                    {(song.artistSongs as unknown as {
                        artist: { artistName: string }
                    }[]).map((e) => (e.artist.artistName)).join(', ')}
                </h5>
            </div>

            {playlists !== null ? (<div className="relative flex justify-end items-center gap-1 mb-1">
               <div className={`mr-auto ml-1 flex gap-1 items-center text-[#b1b1b1] text-[12px]`}>
                   <Clock size={13}/>
                   <div>{`${Math.floor(song.duration! / 60)}:${Math.floor(song.duration! % 60).toString().padStart(2, '0')}`}</div>
               </div>
                <Ellipsis size={15} color={`white`} className={'show-options hover:bg-zinc-500'}
                          onClick={handleOnMouseOverPlaylist} onMouseOut={handleOnMouseOutPlaylist}/>
                <div className={`all-options hidden absolute`}>
                    <div
                        className={`card-all-options bg-[#3b3b3b] w-44 h-[70px] translate-x-[-2px] border-2 border-solid border-white absolute z-50 bottom-0 rounded-sm translate-y-4 flex flex-col justify-center items-center`}>
                        <div className={`grid place-items-start place-content-center gap-2`}>

                            <div className="flex justify-center items-center gap-2 z-50"
                                 onClick={() => path === '/' || path === '/pages/music' ? handleInsertSong(song.songId!) : path === '/pages/liked-songs' ?  handleRemoveLiked(song.songId!, songs!) : handleRemoveSongInPlaylist(song.songId!)}>
                                {
                                    path === '/' || path === '/pages/music' ? (
                                        <CirclePlus color={`white`} size={20}/>
                                    ) : (
                                        <Trash color={`white`} size={20}/>
                                    )
                                }
                                <span className="no-underline text-white text-sm font-Oswald">{
                                    path === '/' || path === '/pages/music' ? 'Thêm vào yêu thích' : path === '/pages/liked-songs' ? 'Xóa khỏi yêu thích' : 'Xóa khỏi playlist'
                                }</span>
                            </div>
                            <div className="all-playlists flex justify-center items-center gap-2 z-50 relative ">
                                <ListPlus color={`white`} size={22}/>
                                <span
                                    className="text-white text-sm font-Oswald -ml-[1px]">Thêm
                    vào playlist</span>
                                <ChevronRight size={20} color={`white`}/>
                                <div
                                    className={`playlist-item hidden bg-[#3b3b3b] border-2 border-solid border-white rounded-sm  absolute translate-x-44 bottom-0 translate-y-[10px]`}>
                                    {playlists && playlists.length > 0 ? (
                                        <ScrollArea className={`w-52 h-40`}>
                                            <div className={`flex flex-col justify-center items-center gap-3 p-3`}>
                                                {(playlists.map((playlist) => <PlaylistCard key={playlist.playlistId}
                                                                                            songId={song.songId!}
                                                                                            playlistId={playlist.playlistId!}
                                                                                            playlistName={playlist.playlistName!}/>))}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <div className={`flex flex-col justify-center items-center gap-3 w-52 h-40`}>
                                            <p className={`text-center text-white uppercase text-sm`}>Chưa có danh sách phát</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>) : null}

        </section>
    );
}

export default MusicCard;

