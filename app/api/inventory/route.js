// import { NextResponse } from "next/server";
// import Inventory from "../../../models/inventory";
// import { dbConnect } from "../dbConnect";

// export async function GET() {
//     await dbConnect(); // Reused MongoDB connection
//     try {
  
//         const inventory = await Inventory.find();
//         return NextResponse.json({inventory});
//     } catch (error) {
//         console.error("Error fetching tables:", error);
//         return NextResponse.json({ error: "Error fetching inventory" }, { status: 500 });
//     }
// }

// export async function POST(request) {
//     const { title,quantity,ml,received} = await request.json();
//     await dbConnect(); // Reused MongoDB connection
//     await Inventory.create({title,quantity,ml,received});
//     return NextResponse.json({ message: "Inventory added successfully." }, { status: 201 });
// }

import { NextResponse } from "next/server";
import { Inventory } from "../../../models/inventory";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";
import dayjs from "dayjs";

export async function GET(request) {
    await dbConnect();
    try {
        const url = new URL(request.url);
        const date = url.searchParams.get('date');
        const today = url.searchParams.get("today");
        const lastWeek = url.searchParams.get("lastWeek");
        const lastMonth = url.searchParams.get("lastMonth");
        const startDate = url.searchParams.get("startDate");
        const endDate = url.searchParams.get("endDate");

        let targetDate = date ? new Date(date) : new Date();
        let nextDay = new Date(targetDate);
        
        // Date range filtering
        if (today === "true") {
            const startOfToday = dayjs().startOf('day').toDate();
            const endOfToday = dayjs().endOf('day').toDate();
            targetDate = startOfToday;
            nextDay = endOfToday;
        } else if (lastWeek === "true") {
            const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day').toDate();
            const todayEnd = dayjs().endOf('day').toDate();
            targetDate = oneWeekAgo;
            nextDay = todayEnd;
        } else if (lastMonth === "true") {
            const oneMonthAgo = dayjs().subtract(1, 'month').startOf('day').toDate();
            const todayEnd = dayjs().endOf('day').toDate();
            targetDate = oneMonthAgo;
            nextDay = todayEnd;
        } else if (startDate && endDate) {
            // Custom date range
            const start = dayjs(startDate).startOf('day').toDate();
            const end = dayjs(endDate).endOf('day').toDate();
            targetDate = start;
            nextDay = end;
        } else {
            // Default: single day view
            targetDate.setHours(0, 0, 0, 0);
            nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);
        }

        // Get sales data from customer orders for the date range
        const salesMatchStage = {
            createdAt: {
                $gte: targetDate,
                $lt: nextDay
            },
            $or: [
                { order_title: { $in: ["Tuborg Gold", "Gorkha Strong", "Barahsinghe", "Tuborg Strong", "Water", "Shikhar Ice", "Surya Red", "Surya Light", "Coil"] } },
                { order_title: { $regex: /8848/i } },
                { order_title: { $regex: /Nude/i } },
                { order_title: { $regex: /Absolute/i } },
                { order_title: { $regex: /Old Durbar Regular/i } },
                { order_title: { $regex: /Chimney/i } },
                { order_title: { $regex: /Gurkhas & Guns/i } },
                { order_title: { $regex: /Jack Daniel/i } },
                { order_title: { $regex: /Glenfiddhich/i } },
                { order_title: { $regex: /JW Double/i } },
                { order_title: { $regex: /JW Black/i } },
                { order_title: { $regex: /Chivas/i } },
                { order_title: { $regex: /Jameson/i } },
                { order_title: { $regex: /Baileys/i } },
                { order_title: { $regex: /Triple/i } },
                { order_title: { $regex: /Khukri Rum light/i } },
                { order_title: { $regex: /Khukri Rum dark/i } },
                { order_title: { $regex: /Khukri Spiced Rum/i } },
                { order_title: { $regex: /Beefeater/i } },
                { order_title: { $regex: /Snow man/i } },
                { order_title: { $regex: /Agavita/i } }
            ]
        };

        const ordersWithSales = await CustomerOrder.aggregate([
            { $match: salesMatchStage },
            {
                $group: {
                    _id: "$order_title",
                    total_quantity: { $sum: "$order_quantity" }
                }
            }
        ]);

        // Create ML products mapping
        const mlProducts = {
            "8848": 0,
            "Nude": 0,
            "Absolute": 0,
            "Old Durbar Regular": 0,
            "Chimney": 0,
            "Gurkhas & Guns": 0,
            "Jack Daniel": 0,
            "Glenfiddich": 0,
            "JW Double": 0,
            "JW Black": 0,
            "Chivas": 0,
            "Jameson": 0,
            "Baileys": 0,
            "Triple": 0,
            "Khukri Rum light": 0,
            "Khukri Rum dark": 0,
            "Khukri Spiced Rum": 0,
            "Beefeater": 0,
            "Snow man": 0,
            "Agavita": 0
        };

        // Create sales map for regular items (non-ML)
        const salesMap = {};

        // Calculate ML sales for all ML-based products
        ordersWithSales.forEach(order => {
            const title = order._id;
            const quantity = order.total_quantity;
            const normalizedTitle = title.toLowerCase();
            
            let isMlProduct = false;
            
            // Check if this is an ML-based product
            for (const product in mlProducts) {
                if (normalizedTitle.includes(product.toLowerCase())) {
                    const mlMatch = title.match(/(\d+)ml/i);
                    const mlValue = mlMatch ? parseInt(mlMatch[1]) : 750;
                    mlProducts[product] += quantity * mlValue;
                    isMlProduct = true;
                    break;
                }
            }
            
            // If not an ML product, add to regular sales map
            if (!isMlProduct) {
                salesMap[title] = (salesMap[title] || 0) + quantity;
            }
        });

        // Check if we're querying a specific date range or latest records
        const hasDateFilter = today || lastWeek || lastMonth || startDate || endDate || date;

        if (hasDateFilter) {
            // Get inventory for the date range
            const dailyRecords = await Inventory.find({ 
                date: {
                    $gte: targetDate,
                    $lt: nextDay
                }
            });

            // Update sales field with actual order data
            const updatedRecords = dailyRecords.map(record => {
                let sales = 0;
                let closing = 0;
                
                // Check if this is an ML-based product
                let isMlProduct = false;
                for (const product in mlProducts) {
                    if (record.title.toLowerCase().includes(product.toLowerCase())) {
                        sales = mlProducts[product];
                        // CORRECTED: Include manualOrderAdjustment in closing calculation
                        closing = record.opening + record.received - sales - record.manualOrderAdjustment;
                        isMlProduct = true;
                        break;
                    }
                }
                
                // If not ML-based, use regular sales
                if (!isMlProduct) {
                    sales = salesMap[record.title] || 0;
                    // CORRECTED: Include manualOrderAdjustment in closing calculation
                    closing = record.opening + record.received - sales - record.manualOrderAdjustment;
                }
                
                return {
                    ...record.toObject(),
                    sales: sales,
                    closing: closing
                };
            });

            return NextResponse.json({ inventory: updatedRecords });
        } else {
            // Get current inventory - show latest records for each item (no date filter)
            const latestRecords = await Inventory.aggregate([
                {
                    $sort: { date: -1 }
                },
                {
                    $group: {
                        _id: "$title",
                        doc: { $first: "$$ROOT" }
                    }
                },
                {
                    $replaceRoot: { newRoot: "$doc" }
                }
            ]);

            // Update sales and closing for latest records
            const updatedRecords = latestRecords.map(record => {
                let sales = 0;
                let closing = 0;
                
                // Check if this is an ML-based product
                let isMlProduct = false;
                for (const product in mlProducts) {
                    if (record.title.toLowerCase().includes(product.toLowerCase())) {
                        sales = mlProducts[product];
                        // CORRECTED: Include manualOrderAdjustment in closing calculation
                        closing = record.opening + record.received - sales - record.manualOrderAdjustment;
                        isMlProduct = true;
                        break;
                    }
                }
                
                // If not ML-based, use regular sales
                if (!isMlProduct) {
                    sales = salesMap[record.title] || 0;
                    // CORRECTED: Include manualOrderAdjustment in closing calculation
                    closing = record.opening + record.received - sales - record.manualOrderAdjustment;
                }
                
                return {
                    ...record,
                    sales: sales,
                    closing: closing
                };
            });

            return NextResponse.json({ 
                inventory: updatedRecords
            });
        }
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return NextResponse.json({ error: "Error fetching inventory" }, { status: 500 });
    }
}

export async function POST(request) {
  const { title, ml, bottle, received, category, threshold, opening } = await request.json();
  await dbConnect();
  
  try {
    // Create new inventory item with today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newItem = await Inventory.create({ 
      title, 
      ml, 
      bottle,
      category: category || "Other",
      threshold: threshold || 5,
      opening: opening || 0,
      received: received || 0,
      sales: 0,
      closing: (opening || 0) + (received || 0), // Calculate closing
      date: today
    });
    
    return NextResponse.json({ message: "Inventory added successfully.", item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory:", error);
    return NextResponse.json({ error: "Error creating inventory" }, { status: 500 });
  }
}