"use client"

import {ColumnDef} from "@tanstack/react-table"
import { ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";

import {User} from "@/data/model/user.model";


export const columns: ColumnDef<User>[] = [

    {
        accessorKey: "userName",
        header: 'User Name',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("userName")}</div>
        ),

    },

    {
        accessorKey: 'name',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },

    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("email")}</div>
        ),
    },


]
