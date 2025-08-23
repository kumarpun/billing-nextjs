import { NextResponse } from "next/server";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";
import dayjs from "dayjs";

export async function GET(request) {
    await dbConnect();

    const url = new URL(request.url);
    const today = url.searchParams.get("today");
    const lastWeek = url.searchParams.get("lastWeek");
    const lastMonth = url.searchParams.get("lastMonth");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const matchStage = {
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
            { order_title: { $regex: /Chivas/i } },
            { order_title: { $regex: /Baileys/i } },
            { order_title: { $regex: /Triple/i } },
            { order_title: { $regex: /Baileys/i } },
            { order_title: { $regex: /Khukri Rum light/i } },
            { order_title: { $regex: /Khukri Rum dark /i } },
            { order_title: { $regex: /Khukri Spiced Rum/i } },
            { order_title: { $regex: /Beefeater/i } },
            { order_title: { $regex: /Snow man/i } },
            { order_title: { $regex: /Agavita/i } },
            { order_title: { $regex: /Triple/i } },  ]
    };

    // Date range filtering
    if (today === "true") {
        const startOfToday = dayjs().startOf('day').toDate();
        const endOfToday = dayjs().endOf('day').toDate();
        matchStage.createdAt = { $gte: startOfToday, $lte: endOfToday };
    } else if (lastWeek === "true") {
        const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();
        matchStage.createdAt = { $gte: oneWeekAgo, $lte: todayEnd };
    } else if (lastMonth === "true") {
        const oneMonthAgo = dayjs().subtract(1, 'month').startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();
        matchStage.createdAt = { $gte: oneMonthAgo, $lte: todayEnd };
    } else if (startDate && endDate) {
        // Custom date range
        const start = dayjs(startDate).startOf('day').toDate();
        const end = dayjs(endDate).endOf('day').toDate();
        matchStage.createdAt = { $gte: start, $lte: end };
    }

    try {
        const ordersWithTables = await CustomerOrder.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$order_title",
                    total_quantity: { $sum: "$order_quantity" }
                }
            },
            { $sort: { total_quantity: -1 } }
        ]);

        // Initialize result with default values for known products
        const result = {
            "Tuborg Gold": 0,
            "Gorkha Strong": 0,
            "Barahsinghe": 0,
            "Tuborg Strong": 0,
            "Water": 0,
            "Shikhar Ice": 0,
            "Surya Red": 0,
            "Surya Light": 0,
            "Coil": 0,
        };

        // Create an object to store ml totals for all products that need it
        const mlTotals = {
            "8848": 0,
            "Nude": 0,
            "Absolute": 0,
            "Old Durbar Regular": 0,
            "Chimney": 0,
            "Gurkhas & Guns": 0,
            "Jack Daniel": 0,
            "Glenfiddhich": 0,
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

        ordersWithTables.forEach(order => {
            const title = order._id;
            const quantity = order.total_quantity;
            
            // Check if this is a predefined product (case insensitive)
            const normalizedTitle = title.toLowerCase();
            let foundPredefined = false;
            
            for (const key in result) {
                if (normalizedTitle.includes(key.toLowerCase())) {
                    result[key] += quantity;
                    foundPredefined = true;
                    break;
                }
            }
            
            // If not a predefined product, add it as a new property
            if (!foundPredefined) {
                result[title] = (result[title] || 0) + quantity;
            }
            
            // Calculate ml for all products that need it
            for (const product in mlTotals) {
                if (normalizedTitle.includes(product.toLowerCase())) {
                    // Extract ml value from title (e.g., "Old Durbar Regular - 60ml" → 60)
                    const mlMatch = title.match(/(\d+)ml/i);
                    const mlValue = mlMatch ? parseInt(mlMatch[1]) : 750; // Default to 750ml if not specified
                    mlTotals[product] += quantity * mlValue;
                    break; // Break after first match to avoid double counting
                }
            }
        });

        // Add all the ml totals to the response
        const response = {
            ...result,
            ...Object.fromEntries(
                Object.entries(mlTotals).map(([key, value]) => [
                    `total_${key.replace(/\s+/g, '_')}_ml`,
                    value
                ])
            )
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}