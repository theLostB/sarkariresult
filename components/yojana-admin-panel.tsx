"use client";
import { useState, useEffect } from "react";
import YojanaPostingForm from "@/components/yojana-posting-form";
import JobsShimmer from "./jobs-shimmer";

export default function YojanaAdminPanel({ activeTab }: { activeTab: string }) {
  const [yojanas, setYojanas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editYojana, setEditYojana] = useState<any | undefined>(undefined);

  useEffect(() => {
    fetchYojanas();
  }, []);

  const fetchYojanas = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/yojanas');
      const data = await res.json();
      // Accept both sarkariYojana (new) and yojanas (old) for compatibility
      const arr = Array.isArray(data.sarkariYojana) ? data.sarkariYojana : (Array.isArray(data.yojanas) ? data.yojanas : []);
      setYojanas(arr);
    } catch (err) {
      setYojanas([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract eligibility fields as an array for UI display (like jobs)
  function getEligibilityPosts(yojana: any) {
    const posts = [];
    for (let i = 1; i <= 10; i++) {
      const name = yojana[`postName${i}`];
      const eligibility = yojana[`postEligibility${i}`];
      const ageLimit = yojana[`postAgeLimit${i}`];
      if (name || eligibility || ageLimit) {
        posts.push({ name, eligibility, ageLimit });
      }
    }
    return posts;
  }

  const handleSaveYojana = async (yojana: any) => {
    setShowForm(false);
    setEditYojana(undefined);
    try {
      if ('id' in yojana && !yojana.id) {
        delete yojana.id;
      }
      const saveRes = await fetch('/api/yojanas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yojana),
      });
      const result = await saveRes.json();
      if (!saveRes.ok) {
        throw new Error(result.error || 'Failed to save yojana');
      }
      await fetchYojanas();
      alert('Yojana saved successfully!');
    } catch (err) {
      console.error('Error saving yojana:', err);
      alert('Failed to save yojana: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleEdit = (yojana: any) => {
    setEditYojana(yojana);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this yojana?")) return;
    const res = await fetch(`/api/yojanas?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await res.json();
    if (res.ok && result.success) {
      setYojanas(yojanas.filter(y => y.id !== id));
      alert("Yojana deleted!");
    } else {
      alert("Delete failed: " + (result.error || res.statusText));
    }
    fetchYojanas();
  };

  const handleCancel = () => {
    setEditYojana(undefined);
    setShowForm(false);
  };

  return (
    showForm ? (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <YojanaPostingForm
          initialValues={editYojana}
          onSubmit={handleSaveYojana}
          onCancel={handleCancel}
        />
      </div>
    ) : (
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base md:text-lg lg:text-2xl font-bold text-teal-700">Yojana Listings</h2>
            <div className="text-gray-500 text-xs md:text-sm mt-1">
              Total Yojanas: <span className="font-semibold text-teal-700">{yojanas.length}</span>
            </div>
          </div>
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded font-semibold shadow transition text-xs md:text-sm lg:text-base"
            onClick={() => { setShowForm(true); setEditYojana(undefined); }}
          >
            + Add New Yojana
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
              ) : yojanas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 md:py-6 text-gray-400">No yojanas found.</td>
                </tr>
              ) : yojanas.map((yojana, idx) => (
                <tr key={yojana.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{idx + 1}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{yojana.id}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{yojana.title}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 text-center">{yojana.date || yojana.startDate}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 capitalize text-center">{yojana.category}</td>
                  <td className="py-1 md:py-2 px-1 md:px-2 flex gap-1 justify-center flex-wrap">
                    <button
                      className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-[10px] md:text-xs lg:text-sm"
                      onClick={() => handleEdit(yojana)}
                    >Edit</button>
                    <button
                      className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-[10px] md:text-xs lg:text-sm"
                      onClick={() => handleDelete(yojana.id)}
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
