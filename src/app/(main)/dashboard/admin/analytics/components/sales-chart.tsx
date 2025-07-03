
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import {
  ChartContainer,
  ChartTooltip as ChartTooltipPrimitive,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface SalesChartProps {
  data: { month: string; revenue: number }[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                 <ChartTooltipPrimitive
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
  )
}
