"use client"

import {ColumnDef} from "@tanstack/react-table"
import {MoreHorizontal, ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import {Song} from "@/data/model/song.model";
import {AudioLines} from "lucide-react";
import {Genre} from "@/data/model/genre.model";
import {mutate} from "swr";
import {toast} from "@/components/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";


export const columns: ColumnDef<Song>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'songName',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Song Name
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },

    },
    {
        accessorKey: 'artistSongs',
        header: 'Artists Songs',
        cell: ({row}) => {
            const artistsName = row.getValue("artistSongs") as { artist: { artistName: string } } [];
            return (
                <div className="capitalize">{artistsName && artistsName.map(e => e.artist.artistName).join(", ")}</div>
            )
        }
    },
    {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("duration")}</div>
        ),
    },

    {
        accessorKey: 'genre',
        header: 'Genre Name',
        cell: ({row}) => {
            const genre:Genre = row.getValue("genre");
            return (
                <div className="capitalize">{genre.genreName}</div>
            )
        }
    },
    {
        accessorKey: 'releaseDate',
        header: 'Release Date',
        cell: ({row}) => (
            <div className="capitalize">{new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }).format(new Date(row.getValue("releaseDate")))}</div>
        ),
    },
    {
        accessorKey: 'coverPhoto',
        header: 'Cover Photo',
        cell: ({row}) => (
            <a href={`${process.env.NEXT_PUBLIC_API}${row.getValue("coverPhoto")}`} target={`_blank`}><img
                className="capitalize w-8 h-8 object-cover object-center rounded-sm"
                src={`${process.env.NEXT_PUBLIC_API}${row.getValue("coverPhoto")}`} alt={"img"}/></a>
        ),
    },
    {
        accessorKey: 'filePath',
        header: 'File Path',
        cell: ({row}) => (
            <a href={`${process.env.NEXT_PUBLIC_API}${row.getValue("filePath")}`} target={`_blank`}><AudioLines
                className={`capitalize`}/></a>
        ),
    },
    {
        accessorKey: 'plays',
        header: 'Plays',
        cell: ({row}) => (
            <div className="capitalize">{row.getValue("plays")}</div>
        ),
    },
    {
        id: "actions",
        cell: ({row, table}) => {
            const song = row.original;

            const getIdsSelected = async () => {
                let songs = table.getFilteredSelectedRowModel()
                    .rows
                    .map((row) => row.original.songId);
                songs = songs.length === 0 ? [song.songId] : songs;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/songs`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(songs),
                });
                if (!response.ok) throw new Error('Error delete data')
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/songs`);
                toast({
                    description: "Xoá Thành Công !"
                })

            }

            return (
                <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(String(song.songId))}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <Link
                            href={`/songs-management/form/${song.songId}`}><DropdownMenuItem>Update</DropdownMenuItem></Link>
                        <AlertDialogTrigger asChild>
                            <div
                                className={`hover:bg-neutral-100 dark:hover:bg-neutral-800 relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 dark:focus:bg-neutral-800 dark:focus:text-neutral-50`}>Delete
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc chắn muốn xóa thông tin này không?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={getIdsSelected}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </DropdownMenuContent>
                </DropdownMenu>
        </AlertDialog>
            )
        },
    },

]
