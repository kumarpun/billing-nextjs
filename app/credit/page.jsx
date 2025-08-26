"use client";
import { useEffect, useState } from "react";
import SideNav from "../components/sidenav";
import TopNav from "../components/topnav";

export default function Credit() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [credits, setCredits] = useState([]);
  const [filteredCredits, setFilteredCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    paid: false,
    remarks: ""
  });
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [nameFilter, setNameFilter] = useState("");

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Fetch credits
  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/credit");
      const data = await res.json();
      setCredits(data.creditlist || []);
      setFilteredCredits(data.creditlist || []);
    } catch (err) {
      console.error("Error fetching credits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCredits(); }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...credits];
    
    // Date filter
    if (dateFilter.startDate || dateFilter.endDate) {
      filtered = filtered.filter(c => {
        const cd = new Date(c.date);
        let pass = true;
        if (dateFilter.startDate) pass = pass && cd >= new Date(dateFilter.startDate);
        if (dateFilter.endDate) {
          const ed = new Date(dateFilter.endDate);
          ed.setHours(23,59,59);
          pass = pass && cd <= ed;
        }
        return pass;
      });
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => 
        statusFilter === "paid" ? c.paid : !c.paid
      );
    }
    
    // Name filter
    if (nameFilter) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    setFilteredCredits(filtered);
  }, [dateFilter, statusFilter, nameFilter, credits]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFilterChange = (e) => setDateFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Add or Edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let response;
      if (editingId) {
        // PUT update
        response = await fetch(`/api/credit/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creditlist: [{ ...formData, _id: editingId }] })
        });
      } else {
        // POST new
        response = await fetch("/api/credit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        setSuccessMessage(editingId ? "Credit updated successfully!" : "Credit saved successfully!");
        setFormData({ name: "", date: new Date().toISOString().split("T")[0], amount: "", paid: false, remarks: "" });
        setEditingId(null);
        setShowModal(false);
        fetchCredits();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        console.error("Failed to save/update credit");
      }
    } catch (err) {
      console.error("Error saving/updating credit:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this credit record?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/credit?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccessMessage("Credit deleted successfully!");
        fetchCredits();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error deleting credit:", err);
    } finally { setDeletingId(null); }
  };

  const handleEdit = (credit) => {
    setFormData({
      name: credit.name,
      date: new Date(credit.date).toISOString().split("T")[0],
      amount: credit.amount,
      paid: credit.paid,
      remarks: credit.remarks || ""
    });
    setEditingId(credit._id);
    setShowModal(true);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
  const formatCurrency = (a) => `Rs. ${new Intl.NumberFormat("en-US").format(a)}`;

  const clearFilters = () => {
    setDateFilter({ startDate: "", endDate: "" });
    setStatusFilter("all");
    setNameFilter("");
  };

  const totalAmount = filteredCredits.reduce((s,c)=>s+parseFloat(c.amount||0),0);
  const totalPaid = filteredCredits.filter(c=>c.paid).reduce((s,c)=>s+parseFloat(c.amount||0),0);
  const totalPending = totalAmount-totalPaid;

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen w-full text-gray-800">
      <SideNav activeTab="credit" isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <TopNav isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"}`}>
            <br></br>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={()=>{setFormData({ name: "", date: new Date().toISOString().split("T")[0], amount: "", paid: false, remarks: "" }); setEditingId(null); setShowModal(true);}} 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 flex items-center group"
            >
              <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Credit
            </button>
          </div>

          {successMessage && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm flex items-center animate-fade-in">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Credits</p>
                  <h3 className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(totalAmount)}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Paid Amount</p>
                  <h3 className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(totalPaid)}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Pending Amount</p>
                  <h3 className="text-2xl font-bold mt-2 text-gray-800">{formatCurrency(totalPending)}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section - Fixed layout */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-5 border border-gray-100">    
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    name="startDate" 
                    value={dateFilter.startDate} 
                    onChange={handleFilterChange} 
                    className="border border-gray-200 bg-white text-gray-800 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  />
                  <input 
                    type="date" 
                    name="endDate" 
                    value={dateFilter.endDate} 
                    onChange={handleFilterChange} 
                    className="border border-gray-200 bg-white text-gray-800 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  />
                </div>
              </div>
              
              <div>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 bg-white text-gray-800 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={nameFilter} 
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="border border-gray-200 bg-white text-gray-800 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm pl-10" 
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex justify-end md:justify-start">
                <button 
                  onClick={clearFilters} 
                  className="w-full md:w-auto px-4 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-flex items-center text-gray-500">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading credits...
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold border-b border-gray-200">
                      <th className="py-4 px-6 text-left">Name</th>
                      <th className="py-4 px-6 text-left">Date</th>
                      <th className="py-4 px-6 text-right">Amount</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-left">Remarks</th>
                      <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCredits.length > 0 ? (
                      filteredCredits.map(c => (
                        <tr key={c._id} className="hover:bg-blue-50 transition-colors duration-150">
                          <td className="py-4 px-6 font-medium text-gray-800">{c.name}</td>
                          <td className="py-4 px-6 text-gray-600">{formatDate(c.date)}</td>
                          <td className="py-4 px-6 text-right font-semibold text-gray-800">{formatCurrency(c.amount)}</td>
                          <td className="py-4 px-6 text-center">
                            {c.paid ? (
                              <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 max-w-xs text-gray-600">{c.remarks}</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex justify-center space-x-2">
                              <button 
                                onClick={() => handleEdit(c)} 
                                className="text-blue-500 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-100 transition-colors duration-150"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              {/* <button 
                                onClick={() => handleDelete(c._id)} 
                                disabled={deletingId === c._id}
                                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100 transition-colors duration-150"
                                title="Delete"
                              >
                                {deletingId === c._id ? (
                                  <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mt-4 text-gray-400">No credit records found. Try adjusting your filters or add a new credit.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-200 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? "Edit Credit" : "Add Credit"}</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 rounded-lg p-1 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter name" 
                  className="border border-gray-200 bg-white text-gray-800 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  className="border border-gray-200 bg-white text-gray-800 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Amount (Rs.)</label>
                <input 
                  type="number" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleInputChange} 
                  placeholder="Enter amount" 
                  className="border border-gray-200 bg-white text-gray-800 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                  required 
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="paid" 
                  name="paid" 
                  checked={formData.paid} 
                  onChange={handleInputChange} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
                <label htmlFor="paid" className="ml-2 block text-sm text-gray-600">Mark as paid</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Remarks</label>
                <textarea 
                  name="remarks" 
                  value={formData.remarks} 
                  onChange={handleInputChange} 
                  placeholder="Add any remarks" 
                  rows="3"
                  className="border border-gray-200 bg-white text-gray-800 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-75 flex items-center shadow-sm"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingId ? "Updating..." : "Saving..."}
                    </>
                  ) : editingId ? "Update Credit" : "Save Credit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}