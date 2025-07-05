"use client";
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function PriceList() {
  const [activeTab, setActiveTab] = useState("price");
  const [prices, setPrices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    quantity: '',
    price: '',
    vendor: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const fetchPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/price');
      const data = await response.json();
      setPrices(data.price);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isEditing) {
        const response = await fetch('/api/price', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentId,
            ...formData
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setPrices(prices.map(price => 
            price._id === currentId ? data.price : price
          ));
        }
      } else {
        const response = await fetch('/api/price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setPrices([...prices, data.price]);
        }
      }
      
      setIsModalOpen(false);
      setFormData({ title: '', quantity: '', price: '', vendor: '', phone: '' });
      setIsEditing(false);
      setCurrentId(null);
    } catch (error) {
      console.error('Error saving price:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (price) => {
    setFormData({
      title: price.title,
      quantity: price.quantity,
      price: price.price,
      vendor: price.vendor,
      phone: price.phone
    });
    setIsEditing(true);
    setCurrentId(price._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/price', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (response.ok) {
          setPrices(prices.filter(price => price._id !== id));
        }
      } catch (error) {
        console.error('Error deleting price:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex bg-white text-black min-h-screen">
      <SideNav 
        activeTab={activeTab} 
        isCollapsed={isSidebarCollapsed}
      />
      <TopNav isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 ${isSidebarCollapsed ? "ml-12" : "ml-64"} p-8 bg-white transition-all duration-300`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold font-serif tracking-tight text-black">Price List</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-sm mb-6 flex items-center gap-2 transition-colors duration-200"
              disabled={isLoading}
            >
              <FaPlus className="text-white" /> Add Price
            </button>
          </div>
          
          {isLoading && !isModalOpen ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="overflow-x-auto shadow-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="py-4 px-6 border-b text-left font-medium font-serif">Title</th>
                    <th className="py-4 px-6 border-b text-left font-medium font-serif">Quantity</th>
                    <th className="py-4 px-6 border-b text-left font-medium font-serif">Price</th>
                    <th className="py-4 px-6 border-b text-left font-medium font-serif">Vendor</th>
                    <th className="py-4 px-6 border-b text-left font-medium font-serif">Phone</th>
                    <th className="py-4 px-6 border-b text-left font-medium font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.length > 0 ? (
                    prices.map((price) => (
                      <tr key={price._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-6 border-b border-gray-100 text-black">{price.title}</td>
                        <td className="py-4 px-6 border-b border-gray-100 text-black">{price.quantity}</td>
                        <td className="py-4 px-6 border-b border-gray-100 text-black">Rs. {price.price}</td>
                        <td className="py-4 px-6 border-b border-gray-100 text-black">{price.vendor}</td>
                        <td className="py-4 px-6 border-b border-gray-100 text-black">{price.phone}</td>
                        <td className="py-4 px-6 border-b border-gray-100 text-black">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(price)}
                              className="text-black hover:text-blue-600 transition-colors duration-200 p-2"
                              disabled={isLoading}
                              aria-label="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(price._id)}
                              className="text-black hover:text-red-600 transition-colors duration-200 p-2"
                              disabled={isLoading}
                              aria-label="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-gray-500 italic">
                        No item found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-none p-8 w-full max-w-lg border-4 border-black shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-serif text-black">
                    {isEditing ? 'Edit Price' : 'Add New Price'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditing(false);
                      setFormData({ title: '', quantity: '', price: '', vendor: '', phone: '' });
                    }}
                    className="text-black hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="title">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="quantity">
                      Quantity
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="price">
                      Price (Rs.)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="quantity">
                      Vendor
                    </label>
                    <input
                      type="text"
                      id="vendor"
                      name="vendor"
                      value={formData.vendor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block text-gray-800 mb-2 font-medium uppercase text-sm tracking-wider" htmlFor="quantity">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-black rounded-none focus:outline-none focus:ring-2 focus:ring-black text-black"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                        setFormData({ title: '', quantity: '', price: '', vendor: '', phone: '' });
                      }}
                      className="px-6 py-3 border-2 border-black bg-white text-black hover:bg-gray-100 font-medium transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-black text-white hover:bg-gray-800 font-medium flex items-center gap-2 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="animate-spin">↻</span>
                      ) : null}
                      {isEditing ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}