import Link from "next/link";
import {Music, Pencil, Trash2} from "lucide-react";
import {Playlist} from "@/data/model/playlist.model";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import FormUpdatePlaylist from "@/components/Form/FormUpdatePlaylist";
import {Button} from "@/components/ui/button";
import axios, {AxiosError} from "axios";
import {mutate} from "swr";
import {useApp} from "@/app/Provider/AppContext";
type Props = Playlist;

const PlaylistCardPage = ({
                            playlistId,
                              playlistName
                          }:Props) => {

    const { user } = useApp();

    const handleDeleltePlaylist = () => {
        if (user) {
            axios.delete(`${process.env.NEXT_PUBLIC_API}/api/playlists`, {
                data: {
                    playlistId: playlistId
                }
            }).then(async function (response) {
                if (response.status !== 200) throw new Error("Error occured");
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user.userId}`);
            }).catch(function (err: AxiosError) {
                if (err) console.log(err);
            })
        }
    }

    return (
        <section className="ct-section-playlist relative">
            <Link href={`/pages/playlist-me/${playlistId}`}

                  className="no-underline z-0">
                <div className="card-body grid place-items-center">
                    <Music
                        className='bx bx-music text-gray-200 group-hover:text-white text-2xl'/>
                    <span
                        className="text-md   text-gray-200 group-hover:text-white font-Oswald">{playlistName}</span>
                </div>
            </Link>
                <div className={`flex absolute right-2 bottom-2 gap-2`}>
                    <Dialog key={playlistId}>
                        <DialogTrigger asChild>
                            <Pencil size={18} color={`white`}/>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] !bg-black !text-white">
                            <DialogTitle className={`text-center`}>CẬP NHẬT PLAYLIST</DialogTitle>
                            <FormUpdatePlaylist playlistId={playlistId} playlistName={playlistName} />
                        </DialogContent>
                    </Dialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Trash2 size={18} color={`white`}/>
                        </AlertDialogTrigger>
                        <AlertDialogContent className={`!bg-black`}>
                            <AlertDialogHeader>
                                <AlertDialogTitle className={`!text-white`}>Bạn có chắc chắn muốn xóa playlist vừa chọn?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                               <Button variant={`outline`} className={`!bg-black !text-white`} asChild><AlertDialogCancel>Cancel</AlertDialogCancel></Button>
                                <Button className={`!bg-white !text-black`} asChild onClick={handleDeleltePlaylist}><AlertDialogAction>Continue</AlertDialogAction></Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

        </section>
    )
}

export default PlaylistCardPage;