import Main from "@/components/global/Main";
import {ArrowBigLeft, AudioLines, EllipsisVertical, Pause, PencilLine, Play, Trash2} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import FormUpdatePlaylist from "@/components/Form/FormUpdatePlaylist";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import MusicCard from "@/components/sections/MusicCard";
import {use} from "react";
import {useApp} from "@/app/Provider/AppContext";
import useSWR, {mutate} from "swr";
import {Song} from "@/data/model/song.model";
import {fetcher} from "@/app/Utils/Fetcher";
import {Playlist} from "@/data/model/playlist.model";
import {useAudio} from "@/app/Provider/AudioContext";
import axios, {AxiosError} from "axios";
import {redirect} from "next/navigation";
import SpinnerClient from "@/components/loading/SpinnerClient";

type Props = {
    params?: Promise<{
        id: string;
    }>
}
const ListMusic = ({params}: Props) => {


    const {id} = use(params!);
    const {user} = useApp();
    const {
        data: songs = [],
        isLoading
    } = useSWR<Song[]>(`${process.env.NEXT_PUBLIC_API}/api/playlists-songs/id/${id}`, fetcher);
    const {data: playlists = []} = useSWR<Playlist[]>(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user?.userId}`, fetcher);
    const playlist = playlists.find((playlist) => playlist.playlistId === id);

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


    const handlePlayMusic = (song: Song) => {
        if (songs) {
            if(repeat === 0 || song.songId !== indexPlaying) {
                setSongData(songs);
                loadAudio(song);
            }else {
                togglePlayPauseAudio();
            }
        }
    }

    const handlePlayLikedSongs = () => {
        if(songs.length > 0){
            setIsPlaying((prev) => !prev);
            if (!audioReady.current?.src || !songs.map((e) => e.songId).includes(indexPlaying)){
                setSongData(songs);
                loadAudio(songs[0]);
            } else togglePlayPauseAudio();
        }
    }
    const count: number = songs.length;

    const handleDeletePlaylist = () => {
        if (user) {
            axios.delete(`${process.env.NEXT_PUBLIC_API}/api/playlists`, {
                data: {
                    playlistId: playlist?.playlistId
                }
            }).then(async function (response) {
                if (response.status !== 200) throw new Error("Error occured");
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user.userId}`);
            }).catch(function (err: AxiosError) {
                if (err) console.log(err);
            })
        }
        redirect("/pages/playlists");
    }

    return (
        <>
                {
                    isLoading ? (
                        <div className={`w-full h-full relative`}>
                            <SpinnerClient
                                className={`absolute pb-[9vh] pr-[12vh] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`}/>
                        </div>
                    ) : (
                        <div className={`ml-[1.9rem] flex gap-6 flex-wrap w-full`}>

                            <div className="w-full flex gap-[70px] mb-[20px]">

                                <div
                                    className="text-center w-max flex flex-col gap-5 my-auto place-items-center ml-6 relative">

                                    <div
                                        className="w-[250px] h-[250px] bg-gradient-to-r from-gray-500 to-gray-700 flex justify-center items-center rounded-lg mt-[40px]">
                                        <AudioLines className="text-black opacity-90" size={200}/>
                                    </div>
                                    <div>
                                            <span
                                                className="text-white font-medium font-Righteous text-2xl">{playlist && playlist.playlistName}</span>
                                    </div>
                                    <div>
                                        <span className="text-white font-medium">{count} bài hát</span>
                                    </div>
                                    <div
                                        className={`flex items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%]`}>
                                        <div
                                            className="mb-4 w-[40px] h-[40px] rounded-full bg-transparent outline outline-white flex justify-center items-center cursor-pointer">
                                            <Link href={"/pages/playlists"}><ArrowBigLeft className={`opacity-90`}
                                                                                          size={30} color={`white`}
                                            /></Link>
                                        </div>
                                        <div
                                            className="mx-8 mb-4 w-[60px] h-[60px] rounded-full bg-transparent outline outline-white flex justify-center items-center cursor-pointer">
                                            {isPlaying && songs.map((e) => e.songId).includes(indexPlaying) ?
                                                (<Pause className={`opacity-90 mr-[1px] mt-1px`} size={40}
                                                        color={`white`}
                                                        onClick={handlePlayLikedSongs}/>) : (
                                                    <Play className={`opacity-90`} size={40} color={`white`}
                                                          onClick={handlePlayLikedSongs}/>)}
                                        </div>
                                        <div
                                            className="mb-4 w-[40px] h-[40px] rounded-full bg-transparent outline outline-white flex justify-center items-center cursor-pointer">

                                            <DropdownMenu>
                                                <DropdownMenuTrigger className={`outline-none`}>
                                                    <EllipsisVertical className={`opacity-90`} size={30}
                                                                      color={`white`}/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <Dialog key={playlist && playlist.playlistId}>
                                                        <DialogTrigger asChild>
                                                                <span
                                                                    className={`relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 `}><PencilLine/>Chỉnh Sửa</span>
                                                        </DialogTrigger>
                                                        <DialogContent
                                                            className="sm:max-w-[425px] !bg-black !text-white">
                                                            <DialogTitle className={`text-center`}>CẬP NHẬT
                                                                PLAYLIST</DialogTitle>
                                                            <FormUpdatePlaylist
                                                                playlistId={playlist && playlist.playlistId}
                                                                playlistName={playlist && playlist.playlistName}/>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <DropdownMenuSeparator/>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                    <span
                                                        className={`relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0`}> <Trash2/>Xóa</span>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className={`!bg-black`}>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle className={`!text-white`}>Bạn có chắc
                                                                    chắn
                                                                    muốn xóa playlist vừa chọn?</AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <Button variant={`outline`}
                                                                        className={`!bg-black !text-white`}
                                                                        asChild><AlertDialogCancel>Cancel</AlertDialogCancel></Button>
                                                                <Button className={`!bg-white !text-black`} asChild
                                                                        onClick={handleDeletePlaylist}><AlertDialogAction>Continue</AlertDialogAction></Button>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </div>
                                    </div>
                                </div>

                                <ScrollArea className={`h-[73vh]  w-full`}>
                                    <div className="flex flex-wrap gap-x-6 gap-y-12 ml-[10px] my-4">
                                        {songs.map(
                                            (song) => <MusicCard
                                                key={song.songId} song={song}
                                                isPlaying={isPlaying}
                                                indexPlaying={indexPlaying}
                                                songs={songs}
                                                playlists={playlists}
                                                playlistId={playlist && playlist.playlistId}
                                                handlePlayMusic={
                                                    () => handlePlayMusic(song)
                                                }/>
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

export default ListMusic;