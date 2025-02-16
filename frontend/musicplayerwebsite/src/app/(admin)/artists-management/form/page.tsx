"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {toast} from "@/components/hooks/use-toast"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"

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

    artistName: z.string().min(1, {
        message: 'Vui lòng nhập tên nghệ sĩ !'
    }),
    gender: z.enum(["true", "false"], {
        required_error: "Vui lòng chọn giới tính !",
    }),
    moreInfo: z.string(),
})


const InputForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            gender: "true",
            artistName: "",
            moreInfo: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/artists`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({artistName: data.artistName, gender: data.gender, moreInfo: data.moreInfo}),
        });

        if (!response.ok) throw new Error('Error fetching data from server !');
        form.reset();
        toast({
            description: 'Thêm Thành Công !'
        })

    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                <FormField
                    control={form.control}
                    name="artistName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={`mx-1`}>Tên Nghệ Sĩ</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên Nghệ Sĩ" {...field} className={`w-[99%] ml-1`}/>
                            </FormControl>
                            <FormMessage className={`mx-1`}/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({field}) => (
                        <FormItem className="space-y-3 mx-1">
                            <FormLabel>Giới Tính</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="true"/>
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Nam
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="false"/>
                                        </FormControl>
                                        <FormLabel className="font-normal">Nữ</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="grid w-full gap-1.5">
                    <FormField
                        control={form.control}
                        name="moreInfo"
                        render={({field}) => (
                            <FormItem className="space-y-3 mx-1">
                                <FormLabel>Thông Tin Thêm</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Type your message here" className={`w-[99%]`} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className={`mx-1`}>Lưu</Button>
            </form>
        </Form>
    )
}

const Page = () => {
    return (
        <div className="contain-content mx-16 ">
            <InputForm/>
        </div>

    )
}

export default Page;