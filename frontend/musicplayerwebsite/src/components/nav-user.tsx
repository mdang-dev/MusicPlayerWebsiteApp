"use client"

import {
  LogOut,
  TvMinimal,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CaretSortIcon } from "@radix-ui/react-icons"
import Link from "next/link";
import {useApp} from "@/app/Provider/AppContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React from "react";

export function NavUser() {
  const { isMobile } = useSidebar()

  const { user, logOut } = useApp();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`${process.env.NEXT_PUBLIC_API}${user?.avatar}`} alt={'img'} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.userName}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <CaretSortIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_API}${user?.avatar}`} alt={''} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.userName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={"/"}>
            <DropdownMenuItem>
              <TvMinimal />
              Trang Chủ
            </DropdownMenuItem>
            </Link>
            {/*<DropdownMenuItem onClick={logOut}>*/}
            {/*  <LogOut />*/}
            {/*  Đăng Xuất*/}
            {/*</DropdownMenuItem>*/}
            <AlertDialog>
              <AlertDialogTrigger className={`w-full`}>
                <div
                    className={`relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 dark:focus:bg-neutral-800 dark:focus:text-neutral-50`}>
                  <LogOut/><span
                    className={`font-Roboto text-sm uppercase cursor-pointer`}>Đăng xuất</span>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className={`!bg-black`}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={`!text-white`}>Bạn có chắc chắn muốn đăng
                    xuất?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={`!text-white !bg-neutral-800`}>Cancel</AlertDialogCancel>
                  <AlertDialogAction className={`!bg-white !text-black`} onClick={logOut}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
