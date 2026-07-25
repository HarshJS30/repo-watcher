"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = {
  date: string;
  stars: number;
  forks: number;
  openIssues: number;
};

export default function RepoChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="stars" stroke="#8884d8" />
        <Line type="monotone" dataKey="forks" stroke="#82ca9d" />
        <Line type="monotone" dataKey="openIssues" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
}