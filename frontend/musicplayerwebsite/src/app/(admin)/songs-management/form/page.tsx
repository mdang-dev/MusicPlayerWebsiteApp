"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "@/components/hooks/use-toast"
import * as React from "react"
import {CalendarIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {format} from "date-fns"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import ComboboxSelectArtist from "@/components/FormInput/ComboboxSelectArtists";
import ComboboxSelectGenre from "@/components/FormInput/ComboboxSelectGenre";
import {mutate} from "swr";



const FormSchema = z.object({

    songName: z.string().min(1, {
        message: "Vui lòng nhập tên bài hát !"
    }),
    artists: z.array(z.number().min(1)).min(1, {
        message: "Vui lòng chọn ít nhất một nghệ sĩ !",
    }),
    genre: z.string({
        required_error: "Vui lòng chọn thể loại !",
    }),
    releaseDate: z.date({
        required_error: "Vui lòng chọn ngày !",
    }),
    coverPhoto: z
        .instanceof(FileList)
        .refine((file) => file?.length == 1, 'Vui lòng chọn ảnh bìa !'),

    filePath: z
        .instanceof(FileList)
        .refine((file) => file?.length == 1, 'Vui lòng chọn file audio !'),
    duration: z.string().optional()
});



const Page = () => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            songName: "",
            artists: [],
            releaseDate: new Date(),
            duration: "",
        },
    })

    const fileRefCoverPhoto = form.register("coverPhoto");
    const fileRefFilePath = form.register("filePath");

   async function onSubmit(data: z.infer<typeof FormSchema>) {
        const formData = new FormData();
        const jsonData = {
            songName: data.songName,
            artists: data.artists,
            genre: data.genre,
            releaseDate: data.releaseDate,
            duration: data.duration,
        }
        formData.append("coverPhoto", data.coverPhoto[0]);
        formData.append("filePath", data.filePath[0]);
        formData.append("jsonData", JSON.stringify(jsonData));
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/songs`, {
            method: "POST",
            body: formData
        })
       if(!response.ok) throw new Error("Failed to upload data.");
       await mutate(`${process.env.NEXT_PUBLIC_API}/api/songs`);
       form.reset();
       toast({
           description: "Thêm Thành Công !"
       })

    }

    const handleChangeFileAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) throw new Error("No file have been selected yet !");
        fileRefFilePath.onChange(e).then(r => r);
        const fileUrl = URL.createObjectURL(file);
        const audioElement = new Audio(fileUrl);
        audioElement.addEventListener("loadedmetadata", function () {
            form.setValue("duration", String(Math.floor(audioElement.duration)));
            URL.revokeObjectURL(fileUrl);
        });
    }

    return (
        <div className="contain-content mx-16 ">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full" encType={`multipart/form-data`}>
                    <FormField
                        control={form.control}
                        name="songName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={`mx-1`}>Tên Bài Hát</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tên Bài Hát" {...field} className={`w-[99%] ml-1`}/>
                                </FormControl>
                                <FormMessage className={`mx-1`}/>
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name={"artists"} render={({field}) => (
                        <FormItem>
                            <FormLabel className={`ml-1`}>Nghệ Sĩ</FormLabel>
                            <FormControl>
                                <div>
                                    <ComboboxSelectArtist values={field.value} onChange={(newValues) => {
                                        field.onChange(newValues);
                                    }}  />
                                </div>
                            </FormControl>
                            <FormMessage className={`mx-1`}/>
                        </FormItem>

                    )}/>

                    <FormField
                        control={form.control}
                        name="genre"
                        render={({field}) => (
                            <FormItem className="flex flex-col mx-1">
                                <FormLabel>Thể Loại</FormLabel>
                                    <ComboboxSelectGenre field={field} onChange={(value) => { field.onChange(value); } } />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className={`w-full flex flex-row gap-3`}>
                        <div className={`basis-5/6 w-full`}>
                            <FormField
                                control={form.control}
                                name="coverPhoto"
                                render={() => {
                                    return (
                                        <FormItem className={`mx-1`}>
                                            <FormLabel>Ảnh Bìa</FormLabel>
                                            <FormControl>
                                                <Input type="file" placeholder="shadcn" {...fileRefCoverPhoto} name={`coverPhoto`} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <div className={`basis-1/6 w-full`}>
                            <FormField
                                control={form.control}
                                name="releaseDate"
                                render={({field}) => (
                                    <FormItem className="">
                                        <FormLabel>Ngày Phát Hành</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Chọn Ngày</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className={`flex flex-row w-full gap-3`}>
                        <div className={`basis-5/6`}>
                            <FormField
                                control={form.control}
                                name="filePath"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className={`mx-1`}>File Audio</FormLabel>
                                        <FormControl>
                                            <Input placeholder="File Audio" {...fileRefFilePath}
                                                   className={`w-full  ml-1`}
                                                   type={`file`} accept={`audio/*`}
                                                   name={`filePath`}
                                                    onChange={handleChangeFileAudio}/>
                                        </FormControl>
                                        <FormMessage className={`mx-1`}/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className={`basis-1/6`}>
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className={`mx-1`}>Thời Lượng</FormLabel>
                                        <FormControl>
                                            <Input placeholder="00:00" {...field}  className={`w-[99%]`} />
                                        </FormControl>
                                        <FormMessage className={`mx-1`}/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>


                    <Button type="submit" className={`mx-1`}>Lưu</Button>
                </form>
            </Form>
        </div>
    )
}


export default Page;