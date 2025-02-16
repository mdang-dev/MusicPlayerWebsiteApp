"use client"
import { columns } from "@/components/data-table/genre/Column";
import {DataTable} from "@/components/data-table/genre/Table";
import {Genre} from "@/data/model/genre.model";
import React from "react";
import useSWR from "swr";
import Spinner from "@/components/loading/Spinner";

const fetcher =
    (url :string)
        : Promise<Genre[]> => fetch(url)
        .then((res) => res.json());

const DemoPage =   () =>  {

    const {data, isLoading} = useSWR<Genre[]>('http://localhost:8080/MusicPlayerServer/api/genres', fetcher);

    return (
        <div className="contain-content mx-10 -mt-6">
            {
                isLoading ? (
                    <Spinner/>
                    ) : (
                    <DataTable  columns={columns} data={data!}/>
                )
            }
        </div>
    )
}
export default DemoPage;


