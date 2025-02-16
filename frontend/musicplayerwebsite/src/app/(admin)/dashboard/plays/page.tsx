"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer, ChartLegend, ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import useSWR from "swr";
import {Song} from "@/data/model/song.model";
import Spinner from "@/components/loading/Spinner";
import {fetcher} from "@/app/Utils/Fetcher";


const chartConfig = {
    plays: {
        label: "Lượt Nghe",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function Component() {

    const { data: chartData = [], isLoading } = useSWR<Song[]>(`${process.env.NEXT_PUBLIC_API}/api/songs/top-plays`, fetcher);

    return (
        <>
            {
                isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <Card className="w-[94%] lg:mx-12 sm:ml-6 max-sm:ml-3 md:ml-6">
                            <CardHeader>
                                <CardTitle>TOP 10 BÀI HÁT CÓ LƯỢT NGHE NHIỀU NHẤT</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="w-full lg:h-[500px] 2xl::h-[500px]">
                                    <BarChart width={undefined} height={400} data={chartData.reverse()}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="songName"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value}
                                        />
                                        <ChartTooltip
                                            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                                            content={
                                                <ChartTooltipContent
                                                    indicator="dashed"
                                                    className="bg-white text-black p-2 rounded"
                                                />
                                            }
                                        />
                                        <Bar dataKey="plays" fill="var(--color-plays)" radius={4} />
                                        <ChartLegend content={<ChartLegendContent />} className={`mt-3`}/>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </>
                )
            }
        </>
    );
}
