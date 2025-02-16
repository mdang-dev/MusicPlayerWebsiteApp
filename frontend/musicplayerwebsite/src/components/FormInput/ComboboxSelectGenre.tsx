"use client"

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {FormControl} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import * as React from "react";
import {Genre} from "@/data/model/genre.model";
import {useEffect, useState} from "react";


type PageProps = {
    field: {
        value: string;
    };
    onChange: (value: string) => void;
}

const getGenres = async ():Promise<Genre[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/genres`);
    return response.ok ? response.json() : [];
}


const ComboboxSelectGenre:React.FC<PageProps> = ({field, onChange}) => {

    const [genreList, setGenreList] = useState<Genre[]>([]);
    useEffect(() => {

        const fetchGenres = async () => {
            const genresData = await getGenres();
            setGenreList(genresData);
        }
        fetchGenres().catch((err) => console.log(err));
    }, []);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        {field.value
                            ? genreList.find(
                                (genre) => genre.genreId === Number(field.value)
                            )?.genreName
                            : "Chọn Thể Loại"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search genres..."/>
                    <CommandList>
                        <CommandEmpty>No genre found.</CommandEmpty>
                        <CommandGroup>
                            {genreList.map((genre) => (
                                <CommandItem
                                    value={String(genre.genreId)}
                                    key={genre.genreId}
                                    keywords={[genre.genreName]}
                                    onSelect={(currentValue) => {
                                        onChange(String(currentValue));
                                    }}
                                >
                                    {genre.genreName}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            String(genre.genreId) === String(field.value)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )

}

export default ComboboxSelectGenre;