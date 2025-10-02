import React, { useEffect, useState } from "react";
import ScholarshipPostingForm, { ScholarshipPostingFormValues } from "./scholarship-posting-form";
import JobsShimmer from "./jobs-shimmer";

interface ScholarshipWithId extends ScholarshipPostingFormValues {
  id: string;
  date?: string;
}

export default function ScholarshipAdminPanel() {
  const [scholarships, setScholarships] = useState<ScholarshipWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editScholarship, setEditScholarship] = useState<ScholarshipWithId | null>(null);

  useEffect(() => {
    fetchScholarships();
  }, []);

  async function fetchScholarships() {
    setLoading(true);
    try {
      const res = await fetch("/api/scholarships");
      const data = await res.json();
      setScholarships(Array.isArray(data.scholarships) ? data.scholarships : []);
    } catch (err) {
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(values: ScholarshipPostingFormValues) {
    const payload = editScholarship ? { ...values, id: editScholarship.id } : values;
    await fetch("/api/scholarships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (editScholarship) {
      alert("Scholarship updated successfully!");
    }
    setShowForm(false);
    setEditScholarship(null);
    fetchScholarships();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;
    await fetch(`/api/scholarships?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    fetchScholarships();
  }

  return (
    showForm ? (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <ScholarshipPostingForm
          initialData={editScholarship || {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditScholarship(null); }}
        />
      </div>
    ) : (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base md:text-lg lg:text-2xl font-bold text-teal-700">Scholarship Listings</h2>
            <div className="text-gray-500 text-xs md:text-sm mt-1">
              Total Scholarships: <span className="font-semibold text-teal-700">{scholarships.length}</span>
            </div>
          </div>
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded font-semibold shadow transition text-xs md:text-sm lg:text-base"
            onClick={() => { setShowForm(true); setEditScholarship(null); }}
          >
            + Add New Scholarship
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full border rounded text-[11px] md:text-xs lg:text-sm">
            <thead>
              <tr className="bg-teal-50 text-teal-700">
                <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">S No.</th>
                <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">ID</th>
                <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">Title</th>
                <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">Date</th>
                <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">Category</th>
                <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-4 md:py-6"><JobsShimmer count={6} /></td>
                </tr>
              ) : scholarships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 md:py-6 text-gray-400">No scholarships found.</td>
                </tr>
              ) : scholarships.map((scholarship, idx) => (
                <tr key={scholarship.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{idx + 1}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{scholarship.id}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{scholarship.title}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 text-center">{scholarship.date}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 capitalize text-center">{scholarship.category}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 flex gap-1 justify-center flex-wrap">
                    <button
                      className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-[10px] md:text-xs lg:text-sm"
                      onClick={() => { setEditScholarship(scholarship); setShowForm(true); }}
                    >Edit</button>
                    <button
                      className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-[10px] md:text-xs lg:text-sm"
                      onClick={() => handleDelete(scholarship.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
}
