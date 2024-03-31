import EditTableForm from "../../components/EditTableForm";

const getTableById = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tables/${id}`, {
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