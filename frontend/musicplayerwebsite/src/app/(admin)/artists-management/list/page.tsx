"use client"

import { columns } from "@/components/data-table/artist/Column";
import {DataTable} from "@/components/data-table/artist/Table";
import {Artist} from "@/data/model/artist.model";
import useSWR from "swr";
import Spinner from "@/components/loading/Spinner";

const fetcher =
    (url: string)
        :Promise<Artist[]> => fetch(url)
        .then((res) => res.json());

const Page =   () =>  {

    const {data, isLoading} = useSWR<Artist[]>(`${process.env.NEXT_PUBLIC_API}/api/artists`, fetcher);
    return (
        <div className="contain-content mx-10 -mt-6">
            {
                isLoading ? (
                    <Spinner/>
                ) : (
                    <DataTable columns={columns} data={data!}/>
                )
            }
        </div>
    )
}

export default Page;