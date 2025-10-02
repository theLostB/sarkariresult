import React, { useEffect, useState } from "react";
import InternshipPostingForm, { InternshipPostingFormValues } from "./internship-posting-form";
import JobsShimmer from "./jobs-shimmer";

interface InternshipWithId extends InternshipPostingFormValues {
  id: string;
  date?: string;
}

export default function InternshipAdminPanel() {
  const [internships, setInternships] = useState<InternshipWithId[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editInternship, setEditInternship] = useState<InternshipWithId | null>(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  async function fetchInternships() {
    setLoading(true);
    try {
      const res = await fetch("/api/internships");
      const data = await res.json();
      setInternships(Array.isArray(data.internships) ? data.internships : []);
    } catch (err) {
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(values: InternshipPostingFormValues) {
    const payload = editInternship ? { ...values, id: editInternship.id } : values;
    await fetch("/api/internships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (editInternship) {
      alert("Internship updated successfully!");
    }
    setShowForm(false);
    setEditInternship(null);
    fetchInternships();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;
    await fetch(`/api/internships?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    fetchInternships();
  }

  return (
    showForm ? (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <InternshipPostingForm
          initialValues={editInternship || {}}
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setEditInternship(null); }}
        />
      </div>
    ) : (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base md:text-lg lg:text-2xl font-bold text-teal-700">Internship Listings</h2>
            <div className="text-gray-500 text-xs md:text-sm mt-1">
              Total Internships: <span className="font-semibold text-teal-700">{internships.length}</span>
            </div>
          </div>
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded rounded font-semibold shadow transition text-xs md:text-sm lg:text-base"
            onClick={() => { setShowForm(true); setEditInternship(null); }}
          >
            + Add New Internship
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
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 md:py-6 text-gray-400">No internships found.</td>
                </tr>
              ) : internships.map((internship, idx) => (
                <tr key={internship.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{idx + 1}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{internship.id}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{internship.title}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 text-center">{internship.date}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 capitalize text-center">{internship.category}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 flex gap-1 justify-center flex-wrap">
                    <button
                      className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-[10px] md:text-xs lg:text-sm"
                      onClick={() => { setEditInternship(internship); setShowForm(true); }}
                    >Edit</button>
                    <button
                      className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-[10px] md:text-xs lg:text-sm"
                      onClick={() => handleDelete(internship.id)}
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
