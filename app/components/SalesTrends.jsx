"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export default function SalesTrendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch("/api/graph");
        const result = await res.json();
        
        const formattedData = result.dailyTotals.map(item => ({
          ...item,
          formattedDate: format(new Date(item.date), "MMM d"),
          rawDate: new Date(item.date),
          displayPrice: `Rs.${(item.totalFinalPrice / 1000).toFixed(0)}K` // Format as Rs.15K, Rs.30K etc.
        })).sort((a, b) => a.rawDate - b.rawDate);
        
        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart 
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f0f0f0" 
          />
          
          <XAxis 
            dataKey="formattedDate"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            padding={{ left: 10, right: 10 }}
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={false}
            width={0}
          />
          
          <Tooltip 
            contentStyle={{
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              border: 'none',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#8884d8' }}
            labelStyle={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}
            formatter={(value) => [`Rs.${value.toLocaleString()}`]} // Full value in tooltip
          />
          
          <Line 
            type="monotone" 
            dataKey="totalFinalPrice" 
            stroke="#8884d8" 
            strokeWidth={2} 
            dot={{
              fill: '#8884d8',
              stroke: '#fff',
              strokeWidth: 1,
              r: 4
            }}
            activeDot={{
              r: 6,
              fill: '#8884d8',
              stroke: '#fff',
              strokeWidth: 1
            }}
            fill="url(#colorUv)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}