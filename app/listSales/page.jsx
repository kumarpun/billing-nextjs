import Link from "next/link";

const getSalesReport = async() => {
    try {
      const res =  await fetch('http://localhost:3000/api/orders', {
            cache: 'no-store',
        });
        if(!res.ok) {
            throw new Error("Failed to fetch report");
        }
        return res.json();
    } catch (error) {
        console.error("Error loading report: ", error);
    }
}

export default async function ListSales() {
    const { ordersWithTables } = await getSalesReport();

    return(
        <>
        <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 navbar nav-color">
        <div style={{ flex: 0 }}></div>
        <Link className="page-title font-bold" href={"/"}>
        {Array.from("VIVID CAFE & BOOZE").map((char, index) => (
        <span key={index} className={`char-${index}`}>{char}</span>
    ))}
      </Link>

  <div style={{ display: 'flex', gap: '12px' }}> 
  <Link className="px-6 py-2 mt-3 add-table" href={"/"}>
        Back
      </Link>
  </div>
    </nav>
    <hr className="separator" />
    <div>
    <br/>
        <div>
        {ordersWithTables.map(sales => (
        <div className="font-bold">Sales report: NRs. {sales.total_bill}</div>
    ))}
        </div>
        </div>
        </>
    )
}