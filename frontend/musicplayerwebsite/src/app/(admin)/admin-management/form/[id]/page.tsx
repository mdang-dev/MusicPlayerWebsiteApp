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

const FormSchema = z.object({
    userId: z.number().optional(),
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
    avatar: z.string(),
    role: z.boolean().optional(),
    confirmPassword: z.string().min(1, {
        message: "Vui lòng xác nhận mật khẩu !"
    })
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Mật khẩu xác nhận không khớp !"
})

type PageProps = {
    params: Promise<{
        id: string;
    }>
}

const Page: React.FC<PageProps> = ({params}) => {
    const {id} = use(params);

    useEffect(() => {
        async function fetchAdmin() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/id/${id}`);
            const data = await response.json();
            form.reset({
                userId: data.userId,
                userName: data.userName,
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role,
                avatar: data.avatar,
                confirmPassword: data.password
            })
        }

        fetchAdmin().catch(e => console.error(e));

    }, [id]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            userId: 0,
            userName: "",
            name: "",
            email: "",
            password: "",
            role: true,
            avatar: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: data.userId,
                userName: data.userName,
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            }),
        });

        if (!response.ok) throw new Error('Error called api ');
        form.reset();
        toast({
            title: "THÔNG BÁO !",
            description: "Cập Nhật Thành Công !"
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
                                    <Input placeholder="user name..." {...field} className={`w-full`}/>
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
                                    <Input placeholder="full name..." {...field} className={`w-full`}
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
                                    <Input placeholder="email..." {...field} className={`w-full`} type={`email`}/>
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
                                    <Input placeholder="password..." {...field} className={`w-full`} type={`password`}/>
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
                                    <Input placeholder="confirm password..." {...field} className={`w-full`}
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

export default Page;
