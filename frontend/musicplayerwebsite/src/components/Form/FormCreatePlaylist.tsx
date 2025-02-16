"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {AlertDialogAction, AlertDialogCancel} from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios, {AxiosError} from "axios";
import {useApp} from "@/app/Provider/AppContext";
import {mutate} from "swr";

const FormSchema = z.object({
    playlistName: z.string().min(1, {
        message: "Vui lòng tên playlists !",
    }),
})

export default function FormCreatePlaylist() {


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            playlistName: "",
        },
    })

    const { user } = useApp();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if(user) {
            axios.post(`${process.env.NEXT_PUBLIC_API}/api/playlists`, {
                userId: user.userId,
                playlistName: data.playlistName,
            }).then(async function (response){
                if(response.status !== 200) throw new Error("Error occured");
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/playlists/user-id/${user.userId}`);
            }).catch(function (err:AxiosError) {
                if(err) console.log(err);
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
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên Playlist</FormLabel>
                                <FormControl>
                                    <Input placeholder="Playlist name.." {...field} className={`w-96 !text-white`}  />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className={`flex items-center gap-3 justify-end`}>
                    <AlertDialogCancel className={`!text-white !bg-black !border-1 !border-solid !border-gray-50`}>THOÁT</AlertDialogCancel>
                    <AlertDialogAction className={`w-40 h-full font-medium !bg-white !text-black`} type={`submit`}>TẠO</AlertDialogAction>
                </div>
            </form>
        </Form>
    )
}
