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
import React from "react";


const FormSchema = z.object({

    genreName: z.string().min(1, {
        message: 'Vui lòng nhập tên thể loại !'
    }),

})


const Page = () => {

     const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            genreName: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/genres`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({genreName: data.genreName,}),
        });

        if (response.ok) {
            form.reset();
            toast({
                description: "Thêm Thành Công !"
            })
        } else
            console.log("Error create data from server !")

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