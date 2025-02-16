import {AudioLines} from "lucide-react";
import {Playlist} from "@/data/model/playlist.model";
import axios from "axios";
import {toast} from "@/components/hooks/use-toast";

type Props = Playlist & {
    songId: number
};

const PlaylistCard = ({
                          playlistId,
                          playlistName,
                          songId
                      }: Props) => {

    const handleInsertSongs = async (playlistId: string, songId: number) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/playlists-songs`, {
                playlistId: playlistId,
                songId: songId
            });
            if (response.status !== 200) throw new Error('Error updating playlist');
            toast({
                description: response.data.message,
            })
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div onClick={() => handleInsertSongs(playlistId!, songId)}
             className={`w-full h-[25px] bg-zinc-100 hover:border-2 hover:border-solid hover:border-zinc-500 flex justify-start items-center gap-2 rounded-sm px-3`}>
            <AudioLines size={20}/>
            <span className={`text-sm font-medium`}>{playlistName}</span>
        </div>
    );
}

export default PlaylistCard;