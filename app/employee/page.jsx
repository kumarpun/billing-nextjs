import Image from "next/image"; // Import Next.js Image component

export default function Employee() {
    // Sample employee data
    const employees = [
      {
        id: 1,
        name: "Mamata Thapa",
        phone: "+1 (555) 123-4567",
        dob: "2005-05-15",
        designation: "Senior Barista",
        image: "/mam.jpg" // Use public path directly
      },
      {
        id: 2,
        name: "Jane Smith",
        phone: "+1 (555) 987-6543",
        dob: "1988-11-22",
        designation: "Service",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      }
    ];
  
    // Format date of birth
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Employee Directory</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex">
                <div className="w-1/3 p-4">
                  {employee.image.startsWith('/') ? (
                    <Image 
                      src={employee.image}
                      alt={employee.name}
                      width={160}
                      height={160}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <img 
                      src={employee.image} 
                      alt={employee.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="w-2/3 p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
                  <div className="mt-3 space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Position:</span> {employee.designation}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {employee.phone}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">DOB:</span> {formatDate(employee.dob)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }