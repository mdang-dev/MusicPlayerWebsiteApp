"use client"

import * as React from "react";
import {useEffect, useState} from "react";
import {Artist} from "@/data/model/artist.model";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";


const getArtists =  async ():Promise<Artist[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/artists`);
    return response.ok ? response.json() : [];
}

const ComboboxSelectArtist = (
    {values: initialValues, onChange}: { values: number[], onChange: (newValues: number[]) => void }
) => {



    const [open, setOpen] = React.useState(false);
    const [artistList, setArtistList] = useState<Artist[]>([]);
    const [selectedValues, setSelectedValues] = useState<number[]>(initialValues);

    useEffect(() => {
        const fetchArtists = async () => {
            const artistsData = await getArtists();
            setArtistList(artistsData);
        };


        fetchArtists().catch((err) => console.log(err));
    },[]);


    useEffect(() => {
        if (JSON.stringify(initialValues) !== JSON.stringify(selectedValues)) {
            setSelectedValues(initialValues);
        }
    }, [initialValues]);

    useEffect(() => {
        if(selectedValues.length !== 0) onChange(selectedValues);
    }, [selectedValues]);


    const findObject = (val: number) => {
        const artist = artistList.find((artist) => artist.artistId === val);
        return artist?.artistName || '';
    };


    const toggleSelected = (currentValue: number) => {
        setSelectedValues((prev) => {
            return prev.includes(currentValue) ?
                prev.filter((value) => value != currentValue) :
                [...prev, currentValue];
        });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[99%] justify-between ml-1"
                >
                    {selectedValues.length > 0
                        ? selectedValues.map((value, index) => {
                            const object = findObject(value);
                            return index === selectedValues.length - 1 ? object : object + " - ";
                        })
                        : "Chọn Nghệ Sĩ..."}
                    <ChevronsUpDown className="opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full">
                <Command>
                    <CommandInput placeholder="Search artists..." className={`w-full`}/>
                    <CommandList>
                        <CommandEmpty>No artist found.</CommandEmpty>
                        <CommandGroup>
                            {artistList.map((artist) => (
                                <CommandItem
                                    key={artist.artistId}
                                    keywords={[artist.artistName]}
                                    value={String(artist.artistId)}
                                    onSelect={(currentValue) => {
                                        toggleSelected(Number(currentValue));
                                        setOpen(false);
                                    }}
                                >
                                    {artist.artistName}
                                    <Check
                                        className={cn(
                                            "ml-auto w-full",
                                            selectedValues.includes(artist.artistId) ? "opacity-100" : "opacity-0"
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

export default ComboboxSelectArtist;