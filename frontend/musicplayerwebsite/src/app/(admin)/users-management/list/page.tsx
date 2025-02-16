"use client"

import { columns } from "@/components/data-table/user/Column";
import {DataTable} from "@/components/data-table/user/Table";
import {User} from "@/data/model/user.model";
import {useEffect, useState} from "react";
import useSWR from "swr";
import Spinner from "@/components/loading/Spinner";


// async function getData(): Promise<User[]> {
//
//
//     // return [
//     //     {
//     //         userId: 1,
//     //         userName: 'User123',
//     //         name: "User 1",
//     //         email: "user1@example.com",
//     //         password: '123'
//     //     },
//     //     {
//     //         userId: 2,
//     //         userName: 'User9090',
//     //         name: "User678",
//     //         email: "user2@example.com",
//     //         password: '123'
//     //     }
//     // ]
//     const resonse = await fetch("/api/users");
// }


const Page =   () =>  {

    const fetcher
        = (url: string)
        :Promise<User[]> =>
        fetch(url)
            .then((res) => res.json());

    const {data, isLoading} = useSWR<User[]>(`${process.env.NEXT_PUBLIC_API}/api/users`, fetcher);


    return (
        <div className="contain-content mx-10 -mt-6">
            {
                isLoading ? (
                    <Spinner/>
                ) : (
                    <DataTable  columns={columns} data={data!}  />
                )
            }
        </div>
    )
}

export default Page;