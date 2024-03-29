import { notFound } from "next/navigation";
export default function StatusDetails({params}: {
    params: {
        productId: string;
        statusId: string;
    };
}) {
    if (parseInt(params.statusId) > 1000) {
        notFound();
    }
  return (
    <div>
      <h1>Status {params.statusId} for product {params.productId}</h1>
    </div>
  )
}