import { NextResponse } from "next/server";
import { Inventory } from "../../../models/inventory";
import { dbConnect } from "../dbConnect";

export async function POST(request) {
  await dbConnect();
  
  try {
    // Get yesterday's date (to find closing data)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // Start of yesterday

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Check if inventory already exists for today
    const existingTodayInventory = await Inventory.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // End of today
      }
    });

    if (existingTodayInventory.length > 0) {
      return NextResponse.json(
        { 
          message: "Inventory for today already exists",
          count: existingTodayInventory.length,
          inventory: existingTodayInventory
        },
        { status: 200 }
      );
    }

    // Find all inventory items from yesterday
    const yesterdayInventory = await Inventory.find({
      date: {
        $gte: yesterday,
        $lt: today
      }
    });

    if (yesterdayInventory.length === 0) {
      return NextResponse.json(
        { message: "No inventory data found for yesterday to carry forward" },
        { status: 404 }
      );
    }

    // Create new inventory entries for today using yesterday's closing as today's opening
    const newInventoryEntries = yesterdayInventory.map(item => ({
      title: item.title,
      ml: item.ml,
      category: item.category,
      threshold: item.threshold,
      opening: item.closing, // Yesterday's closing becomes today's opening
      received: 0, // Reset received for new day
      sales: 0, // Reset sales for new day
      closing: item.closing, // Initial closing same as opening until sales occur
      date: today // Set to today's date
    }));

    // Insert all new inventory entries
    const createdInventory = await Inventory.insertMany(newInventoryEntries);

    return NextResponse.json(
      { 
        message: "Inventory successfully carried forward to today",
        count: createdInventory.length,
        inventory: createdInventory
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error carrying forward inventory:", error);
    return NextResponse.json(
      { message: "Failed to carry forward inventory", error: error.message },
      { status: 500 }
    );
  }
}