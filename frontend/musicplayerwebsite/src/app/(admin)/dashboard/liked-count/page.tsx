"use client"

import { CartesianGrid, AreaChart,Area, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent
} from "@/components/ui/chart"
import useSWR from "swr";
import {fetcher} from "@/app/Utils/Fetcher";
import Spinner from "@/components/loading/Spinner";

type songData = {
    songId: number;
    songName: string;
    likedCount: number;
}

const chartConfig = {
    likedCount: {
        label: "Lượt Yêu Thích",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function Component() {

    const { data: chartData = [], isLoading } = useSWR<songData[]>(`${process.env.NEXT_PUBLIC_API}/api/songs/top-liked`, fetcher);

    return (
      <>
          {
              isLoading ? (
                  <Spinner/>
              ) : (
                  <Card className={`w-[94%] lg:mx-12 sm:ml-6 max-sm:ml-3 md:ml-6`}>
                      <CardHeader>
                          <CardTitle>TOP 10 BÀI HÁT ĐƯỢC YÊU THÍCH NHẤT</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <ChartContainer config={chartConfig} className={`w-full lg:h-[500px] 2xl::h-[500px] `}>
                              <AreaChart
                                  accessibilityLayer
                                  data={chartData}
                                  margin={{
                                      left: 12,
                                      right: 12,
                                      top: 12,
                                  }}
                              >
                                  <CartesianGrid vertical={false} />
                                  <XAxis
                                      dataKey="songName"
                                      tickLine={true}
                                      axisLine={true}
                                      tickMargin={8}
                                      tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                                      angle={45}
                                      interval={0}
                                      padding={{ left: 35, right: 35,}}
                                      textAnchor="start"
                                  />
                                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                  <defs>
                                      <linearGradient id="fillLikedCount" x1="0" y1="0" x2="0" y2="1">
                                          <stop
                                              offset="5%"
                                              stopColor="var(--color-likedCount)"
                                              stopOpacity={0.8}
                                          />
                                          <stop
                                              offset="95%"
                                              stopColor="var(--color-likedCount)"
                                              stopOpacity={0.1}
                                          />
                                      </linearGradient>
                                  </defs>

                                  <Area
                                      dataKey="likedCount"
                                      type="natural"
                                      fill="url(#fillLikedCount)"
                                      fillOpacity={0.4}
                                      stroke="var(--color-likedCount)"
                                      stackId="a"
                                      label={true}
                                      cursor={2}
                                  />
                                  <ChartLegend content={<ChartLegendContent />} className={`mt-3`}/>
                              </AreaChart>
                          </ChartContainer>
                      </CardContent>

                  </Card>
              )
          }
      </>
    )
}
