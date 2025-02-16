"use client"

import { columns } from "@/components/data-table/admin/Column";
import {DataTable} from "@/components/data-table/admin/Table";
import {User} from "@/data/model/user.model";
import useSWR from "swr";
import Spinner from "@/components/loading/Spinner";
import {fetcher} from "@/app/Utils/Fetcher";


const Page =  () =>  {

    const {data, isLoading} = useSWR<User[]>(`${process.env.NEXT_PUBLIC_API}/api/admin`, fetcher);

    return (
        <div className="contain-content mx-10 -mt-6">
            {
                isLoading ? (
                    <Spinner/>
                ) : (
                    <DataTable columns={columns} data={data!}  />
                )
            }
        </div>
    )
}

export default Page;