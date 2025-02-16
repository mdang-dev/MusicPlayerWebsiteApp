"use client"

import { columns } from "@/components/data-table/song/Column";
import {DataTable} from "@/components/data-table/song/Table";
import {Song} from "@/data/repository/song.repo";
import useSWR from "swr";
import Spinner from "@/components/loading/Spinner";

const fetcher =
    (url: string)
        : Promise<Song[]> => fetch(url).then(res => res.json());

const Page =  () =>  {

    const { data, isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API}/api/songs`, fetcher);
    return (
        <div className="contain-content mx-10 -mt-6">
            {
                isLoading ? (
                    <Spinner/>
                ) : (
                    <DataTable  columns={columns} data={data!} />
                )
            }
        </div>
    )
}

export default Page;