"use client"
import dotenv from "dotenv"

dotenv.config();
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";
import {Genre} from "@/data/model/genre.model";
import {toast} from "@/components/hooks/use-toast";
import {mutate} from "swr";


export const columns: ColumnDef<Genre>[] = [


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
        accessorKey: 'genreName',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Genre Name
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },

    },

    {
        id: "actions",
        cell: ({row, table}) => {
            const genre = row.original;

            const getIdsSelected = async () => {
                let genres = table.getFilteredSelectedRowModel()
                    .rows
                    .map((row) => row.original);
                genres = genres.length === 0 ? [genre] : genres;

                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/genres`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(genres),
                });
                if (!response.ok) throw new Error('Error delete data')
                await mutate(`${process.env.NEXT_PUBLIC_API}/api/genres`);
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
                                onClick={() => navigator.clipboard.writeText(String(genre.genreId))}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <Link
                                href={`/genres-management/form/${genre.genreId}`}><DropdownMenuItem>Update</DropdownMenuItem></Link>
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
