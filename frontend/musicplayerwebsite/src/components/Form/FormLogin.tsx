"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

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
import Link from "next/link";
import {useApp} from "@/app/Provider/AppContext";
import {useEffect} from "react";

const FormSchema = z.object({
    email: z.string().min(1, {
        message: "Vui lòng nhập email !",
    }),
    password: z.string().min(1, {
        message: "Vui lòng nhập mật khẩu !"
    })
})

export default function InputForm() {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { loginUser, } = useApp();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
       loginUser(data.email, data.password);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

                <div className={`grid gap-3 mb-5`}>
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
                </div>
                <div className={`mb-3 hover:underline`}>
                    <FormLabel><Link href={"/verify-email"}>Quên Mật Khẩu?</Link></FormLabel>
                </div>
                <Button type="submit">ĐĂNG NHẬP</Button>
            </form>
        </Form>
    )
}
