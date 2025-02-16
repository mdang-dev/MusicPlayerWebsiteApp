"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {AlertDialogAction, AlertDialogCancel} from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import axios, {AxiosError} from "axios";
import {useApp} from "@/app/Provider/AppContext";
import {mutate} from "swr";
import {Playlist} from "@/data/model/playlist.model";
import {Button} from "@/components/ui/button";
import {DialogClose} from "@/components/ui/dialog";

type Props = Playlist;

const FormSchema = z.object({
    playlistId: z.string().optional(),
    playlistName: z.string().min(1, {
        message: "Vui lòng tên playlists !",
    }),
})


export default function FormUpdatePlaylist({
                                               playlistId,
                                               playlistName,
                                           }: Props) {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            playlistId: playlistId,
            playlistName: playlistName
        },
    })

    const {user} = useApp();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (user) {
            axios.put(`${process.env.NEXT_PUBLIC_API}/api/playlists`, {
                playlistId: data.playlistId,
                userId: user.userId,
                playlistName: data.playlistName,
            }).then(async function (response) {
                if (response.status !== 200) throw new Error("Error occured");
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user.userId}`);
            }).catch(function (err: AxiosError) {
                if (err) console.log(err);
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className={`grid gap-3 mb-5`}>
                    <FormField
                        control={form.control}
                        name="playlistName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Playlist Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Playlist name.." {...field} className={`w-ful !text-white`}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className={`flex items-center gap-3 justify-end`}>
                    <Button
                        className={`!text-white !bg-black !border-1 !border-solid !border-gray-50`} variant={`outline`} asChild><DialogClose>THOÁT</DialogClose></Button>
                    <Button className={`w-40 h-full font-medium !bg-white !text-black`}
                                          type={`submit`} asChild><DialogClose>CẬP NHẬT</DialogClose></Button>

                </div>
            </form>
        </Form>
    )
}
