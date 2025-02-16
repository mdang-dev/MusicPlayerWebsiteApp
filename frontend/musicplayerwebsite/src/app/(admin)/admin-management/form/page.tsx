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
import {mutate} from "swr";

const FormSchema = z.object({
    userName: z.string().min(1, {
        message: "Vui lòng nhập email !",
    }),
    name: z.string().min(1, {
        message: "Vui lòng nhập họ tên !"
    }),
    email: z.string().min(1, {
        message: "Vui lòng nhập email !"
    }),
    password: z.string().min(1, {
        message: "Vui lòng nhập mật khẩu !"
    }),
    role: z.boolean(),
    confirmPassword: z.string().min(1, {
        message: "Vui lòng xác nhận mật khẩu !"
    })
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Mật khẩu xác nhận không khớp !"
})

export default function InputForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            userName: "",
            name: "",
            email: "",
            password: "",
            role: true,
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/admin`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: data.userName,
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    avatar: "img1.png",
                }),
            });
            if (!response.ok) throw new Error('Error called api ! ');
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/admin`);
                form.reset();
        toast({
            title: "THÔNG BÁO !",
            description: "Thêm Thành Công !"
        })


    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`mx-16`}>

                <div className={`grid gap-3 mb-5`}>
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="User name..." {...field} className={`w-full`} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Họ Tên</FormLabel>
                                <FormControl>
                                    <Input placeholder="Full name..." {...field} className={`w-full`}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email..." {...field} className={`w-full`} type={`email`}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Mật Khẩu</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password..." {...field} className={`w-full`} type={`password`}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Xác Nhận Mật Khẩu</FormLabel>
                                <FormControl>
                                    <Input placeholder="Confirm password..." {...field} className={`w-full`}
                                           type={`password`}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit">LƯU</Button>
            </form>
        </Form>
    )
}
