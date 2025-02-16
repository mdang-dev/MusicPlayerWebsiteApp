"use client"

import ListMusic from "@/app/pages/playlist-me/ListMusic";

type Props = {
    params: Promise<{
        id: string;
    }>
}


const Page = ({params}: Props) => {

    return <ListMusic params={params}/>

}

export default Page;




