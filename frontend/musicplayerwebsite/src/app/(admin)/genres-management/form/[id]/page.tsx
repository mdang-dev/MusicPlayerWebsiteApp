"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {toast} from "@/components/hooks/use-toast"
import {Button} from "@/components/ui/button"



import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import React, {use, useEffect} from "react";

import {mutate} from "swr";


const FormSchema = z.object({
    genreId: z.number(),
    genreName: z.string().min(1, {
        message: 'Vui lòng nhập tên thể loại !'
    }),
})

type PageProps = {
    params: Promise<{
        id: string;
    }>
}

const Page: React.FC<PageProps> = ({params}) => {
    const { id } = use(params);
    useEffect(() => {
        async function fetchGenre() {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/genres/id/${id}`);
                if(response.ok){
                    const data = await response.json();
                    form.reset({
                        genreId: data.genreId,
                        genreName: data.genreName,
                    })
                }else {
                    console.log(response.statusText);
                }
        }
        fetchGenre().catch((e) => console.error(e));
    }, [id]);

     const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            genreId: 0,
            genreName: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/genres`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({genreId: data.genreId ,genreName: data.genreName}),
        });

        if (!response.ok) throw new Error('Error update date from server !')
           await mutate(`${process.env.NEXT_PUBLIC_API}/api/genres/id/${id}`)
            toast({
                description: "Cập Nhật Thành Công !"
            })


    }

    return (
        <div className="contain-content mx-16 ">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                    <FormField
                        control={form.control}
                        name="genreName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={`mx-1`}>Tên Thể Loại</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tên Thể Loại" {...field} className={`w-[99%] ml-1`}/>
                                </FormControl>
                                <FormMessage className={`mx-1`}/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className={`mx-1`}>Lưu</Button>
                </form>
            </Form>
        </div>

    )
}


export default Page;