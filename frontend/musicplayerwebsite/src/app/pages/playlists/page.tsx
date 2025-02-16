"use client"

import Main from "@/components/global/Main";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Song} from "@/data/model/song.model";
import {Playlist} from "@/data/model/playlist.model";
import {Music, CirclePlus, Pencil, Trash2}  from "lucide-react";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import {useAudio} from "@/app/Provider/AudioContext";
import FormCreatePlaylist from "@/components/Form/FormCreatePlaylist";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {useApp} from "@/app/Provider/AppContext";
import useSWR from "swr";
import {fetcher} from "@/app/Utils/Fetcher";
import PlaylistCardPage from "@/components/sections/PlaylistCardPage";
import {redirect} from "next/navigation";






const PageHome = () => {

    const { user } = useApp();
    if(!user) redirect('/login-register');

    const { data: playlists = [] } = useSWR<Playlist[]>(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user?.userId}`, fetcher);

    return (
                <ScrollArea className={`hide-scrollbar w-full`}>
                    <div className={`ml-[1.9rem] flex gap-6 flex-wrap w-full`}>
                        <AlertDialog>
                            <AlertDialogTrigger>  <section className="ct-section-playlist relative"
                                 data-bs-target="#CreatePlaylist">
                            <div className="card-body grid place-items-center">
                                <CirclePlus
                                    className='bx bx-plus-circle text-gray-200 group-hover:text-white'/>
                                <h3
                                    className="text-md text-gray-200 group-hover:text-white font-Oswald">Tạo
                                    playlist mới</h3>
                            </div>
                        </section>
                               </AlertDialogTrigger>
                                <AlertDialogContent className={`w-max`}>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className={`text-white text-center`}>TẠO PLAYLIST</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className={`text-white`}><FormCreatePlaylist/></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        {
                            playlists.map((playlist) => (
                               <PlaylistCardPage
                                   key={playlist.playlistId}
                                   playlistId={playlist.playlistId}
                                   playlistName={playlist.playlistName}
                               />
                            ))
                        }
                    </div>
                </ScrollArea>


    );
}


export default PageHome;