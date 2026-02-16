import EditTableForm from "../../components/EditTableForm";

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const getTableById = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/tables/${id}`, {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch topic");
      }
  
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

export default async function EditTable({ params }) {
    const { id } = params;
    const { table } = await getTableById(id);
    const { title, description } = table;

    return (
        <EditTableForm id={id} title={title} description={description} />
    )
}