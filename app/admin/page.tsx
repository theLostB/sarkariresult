"use client";
import JobPostingForm from "@/components/job-posting-form";
import ScholarshipAdminPanel from "@/components/scholarship-admin-panel";
import JobsShimmer from "@/components/jobs-shimmer";
import AddResultForm from "@/components/add-result-form";
import AddAnswerKeyForm from "@/components/add-answerkey-form";
import AddAdmitCardForm from "@/components/add-admitcard-form";
import YojanaAdminPanel from "@/components/yojana-admin-panel";
import { useRouter } from "next/navigation";

interface JobPostingFormValues {
  category: string;
  title: string;
  jobDescription: string;
  applyOnlineUrl: string;
  jobNotificationUrl: string;
  officialWebsiteUrl: string;
  startDate: string;
  lastDate: string;
  lastDateFee: string;
  admitCardDate: string;
  examDate: string;
  resultDate: string;
  feeGeneral: string;
  feeSCST: string;
  feeOBC: string;
  totalVacancies: string;
  vacancyGeneral: string;
  vacancyOBC: string;
  vacancySC: string;
  vacancyST: string;
  vacancyEWS: string;
  vacancyPwD: string;
  ageLimit: string;
  educationQualification: string;
  selectionProcess1: string;
  selectionProcess2: string;
  selectionProcess3: string;
  selectionProcess4: string;
  howToApplyUrl: string;
  coachingName1: string;
  coachingUrl1: string;
  coachingName2: string;
  coachingUrl2: string;
  coachingName3: string;
  coachingUrl3: string;
  coachingName4: string;
  coachingUrl4: string;
  coachingName5: string;
  coachingUrl5: string;
  [key: `postName${number}`]: string;
  [key: `postEligibility${number}`]: string;
  [key: `postAgeLimit${number}`]: string;
}

import { useState, useEffect } from "react";
const navItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Post Job", key: "job" },
  { label: "Results", key: "results" },
  { label: "Answer Keys", key: "answerkeys" },
  { label: "Admit Cards", key: "admitcards" },
  { label: "Internships", key: "internships" },
  { label: "Scholarships", key: "scholarships" },
  { label: "Sarkari Yojana", key: "sarkariyojana" },
  { label: "Settings", key: "settings" },
];

const summaryCards = [
  {
    label: "Jobs Posted",
    value: 128,
    icon: (
      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0v6m0-6V5" /></svg>
    ),
    color: "bg-teal-50 border-teal-500",
  },
  {
    label: "Admit Cards",
    value: 7,
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 0 1 0 8M8 7a4 4 0 0 0 0 8m8-8V5a4 4 0 0 0-8 0v2m0 8v2a4 4 0 0 0 8 0v-2" /></svg>
    ),
    color: "bg-blue-50 border-blue-500",
  },
  {
    label: "Answer Keys",
    value: 542,
    icon: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    ),
    color: "bg-yellow-50 border-yellow-500",
  },
  {
    label: "Results",
    value: 3,
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
    color: "bg-green-50 border-green-500",
  },
  {
    label: "Internships",
    value: 128,
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    ),
    color: "bg-indigo-50 border-indigo-500",
  },
  {
    label: "Sarkari Yojana",
    value: 7,
    icon: (
      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
    color: "bg-pink-50 border-pink-500",
  },
  {
    label: "Scholarships",
    value: 542,
    icon: (
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
    ),
    color: "bg-orange-50 border-orange-500",
  },
];

function JobAdminPanel({ activeTab }: { activeTab: string }) {
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobs, setJobs] = useState<Partial<JobPostingFormValues & { id: string }>[] | []>([]);
  const [results, setResults] = useState<any[]>([]);
  const [answerKeys, setAnswerKeys] = useState<any[]>([]);
  const [admitCards, setAdmitCards] = useState<any[]>([]);
  const [showAdmitCardForm, setShowAdmitCardForm] = useState<string | null>(null);
  const [admitCardTitle, setAdmitCardTitle] = useState("");
  const [admitCardUrl, setAdmitCardUrl] = useState("");
  const [admitCardDesc, setAdmitCardDesc] = useState("");
  const [editingAdmitCardId, setEditingAdmitCardId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'jobs' | 'results'>('jobs');

  // Fetch jobs, results, and answerKeys
  useEffect(() => {
    const fetchJobsAndResults = async () => {
      setJobsLoading(true);
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setJobsLoading(false);
      }
      try {
        const res = await fetch('/data.json');
        const data = await res.json();
        if (data && Array.isArray(data.results)) {
          setResults(data.results);
        }
        if (data && Array.isArray(data.answerKeys)) {
          setAnswerKeys(data.answerKeys);
        }
        if (data && Array.isArray(data.admitCards)) {
          setAdmitCards(data.admitCards);
        }
      } catch (err) {
        console.error('Failed to fetch results, answer keys, or admit cards:', err);
      }
    };
    fetchJobsAndResults();
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState<Partial<JobPostingFormValues & { id: string }> | undefined>(undefined);
  // For Add Result form fields (now handled by AddResultForm)
  const [addResultJobId, setAddResultJobId] = useState<string | undefined>(undefined);
  const [editResultId, setEditResultId] = useState<string | undefined>(undefined);
  const [editResultInitial, setEditResultInitial] = useState<{ title: string; url: string; description: string } | undefined>(undefined);
  const [formMode, setFormMode] = useState<'add' | 'update'>('add');

  // For Add/Update Answer Key modal
  const [showAnswerKeyForm, setShowAnswerKeyForm] = useState<string | null>(null);
  const [answerKeyTitle, setAnswerKeyTitle] = useState("");
  const [answerKeyUrl, setAnswerKeyUrl] = useState("");
  const [answerKeyDesc, setAnswerKeyDesc] = useState("");
  const [editingAnswerKeyId, setEditingAnswerKeyId] = useState<string | null>(null);

  // Add or update job
  const handleSaveJob = async (job: JobPostingFormValues) => {
    setShowForm(false);
    setEditJob(undefined);
    try {
      if ('id' in job && !job.id) {
        delete job.id;
      }
      const saveRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      await saveRes.json();
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
      alert('Job saved successfully!');
    } catch (err) {
      alert('Job saved, but failed to refresh job list.');
    }
  };

  // Edit
  const handleEdit = (job: Partial<JobPostingFormValues & { id: string }>) => {
    setEditJob(job);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const res = await fetch(`/api/jobs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const result = await res.json();
    if (res.ok && result.success) {
      setJobs(jobs.filter(j => j.id !== id));
      alert("Job deleted!");
    } else {
      alert("Delete failed: " + (result.error || res.statusText));
    }
  };

  // Cancel form
  const handleCancel = () => {
    setEditJob(undefined);
    setShowForm(false);
  };

  if (showForm && activeTab === "results") {
    return (
      <AddResultForm
        mode={formMode}
        heading={formMode === 'add' ? 'Add Result' : 'Update Result'}
        initialValues={editResultInitial}
        onSubmit={async (data) => {
          if (formMode === 'add') {
            if (!addResultJobId) {
              alert("No job selected!");
              setShowForm(false);
              return;
            }
            // Add new result
            const res = await fetch('/api/results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jobId: addResultJobId,
                title: data.title,
                description: data.description,
                url: data.url,
              }),
            });
            const result = await res.json();
            if (result.success) {
              alert('Result added!');
              setShowForm(false);
              setAddResultJobId(undefined);
              setEditResultId(undefined);
              setEditResultInitial(undefined);
              setFormMode('add');
              // Refetch jobs and results
              try {
                const resJobs = await fetch('/api/jobs');
                const dataJobs = await resJobs.json();
                setJobs(dataJobs.jobs);
                const resResults = await fetch('/data.json');
                const dataResults = await resResults.json();
                setResults(dataResults.results);
              } catch {}
            } else {
              alert('Failed to add result: ' + (result.error || 'Unknown error'));
            }
          } else if (formMode === 'update') {
            if (!editResultId) {
              alert("No result selected for update!");
              setShowForm(false);
              return;
            }
            // Update result
            const res = await fetch('/api/results', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: editResultId,
                title: data.title,
                description: data.description,
                url: data.url,
              }),
            });
            let result: any = {};
            try {
              // Only try to parse if content exists
              const text = await res.text();
              result = text ? JSON.parse(text) : {};
            } catch (err) {
              alert('Update failed: Could not parse server response.');
              return;
            }
            if (result.success) {
              alert('Result updated!');
              setShowForm(false);
              setAddResultJobId(undefined);
              setEditResultId(undefined);
              setEditResultInitial(undefined);
              setFormMode('add');
              // Refetch jobs and results
              try {
                const resJobs = await fetch('/api/jobs');
                const dataJobs = await resJobs.json();
                setJobs(dataJobs.jobs);
                const resResults = await fetch('/data.json');
                const dataResults = await resResults.json();
                setResults(dataResults.results);
              } catch {}
            } else {
              alert('Failed to update result: ' + (result.error || 'Unknown error'));
            }
          }
        }}
        onCancel={() => {
          setShowForm(false);
          setAddResultJobId(undefined);
          setEditResultId(undefined);
          setEditResultInitial(undefined);
          setFormMode('add');
        }}
      />
    );
  }

// Add Answer Key Inline Form
  if (showAnswerKeyForm) {
    return (
      <AddAnswerKeyForm
        mode={editingAnswerKeyId ? "update" : "add"}
        heading={editingAnswerKeyId ? "Update Answer Key" : "Add Answer Key"}
        onSubmit={async ({ title, url, description }) => {
          if (!showAnswerKeyForm) return;
          try {
            let res, result;
            if (editingAnswerKeyId) {
              // Update
              res = await fetch('/api/answerkeys', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: editingAnswerKeyId,
                  title,
                  url,
                  description,
                }),
              });
            } else {
              // Add
              res = await fetch('/api/answerkeys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  jobId: showAnswerKeyForm,
                  title,
                  url,
                  description,
                }),
              });
            }
            try {
              result = await res.json();
            } catch (jsonErr) {
              const text = await res.text();
              alert('Server error: ' + text);
              return;
            }
            if (res.ok && result.success) {
              alert(editingAnswerKeyId ? 'Answer key updated!' : 'Answer key added!');
              // Refetch answer keys
              try {
                const resAnswerKeys = await fetch('/data.json');
                const dataAnswerKeys = await resAnswerKeys.json();
                setAnswerKeys(dataAnswerKeys.answerKeys || []);
              } catch {}
            } else {
              alert('Failed to save answer key: ' + (result.error || res.statusText));
            }
          } catch (err) {
            alert('Error saving answer key: ' + err);
          }
          setShowAnswerKeyForm(null);
          setAnswerKeyTitle("");
          setAnswerKeyUrl("");
          setAnswerKeyDesc("");
          setEditingAnswerKeyId(null);
        }}
        onCancel={() => {
          setShowAnswerKeyForm(null);
          setAnswerKeyTitle("");
          setAnswerKeyUrl("");
          setAnswerKeyDesc("");
          setEditingAnswerKeyId(null);
        }}
        initialValues={{
          title: answerKeyTitle,
          url: answerKeyUrl,
          description: answerKeyDesc,
        }}
      />
    );
  }

  if (showForm) {
    return (
      <div className="bg-white border rounded-lg p-2 md:p-6 shadow-sm w-full max-w-full">
        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-teal-700 text-left">
          {editJob ? "Edit Job" : "Add Job"}
        </h2>
        <JobPostingForm
          onCancel={() => { setEditJob(undefined); setShowForm(false); }}
          onSave={handleSaveJob}
          initialData={editJob}
        />
      </div>
    );
  }

  if (showAdmitCardForm) {
    const isUpdate = !!editingAdmitCardId;
    const heading = isUpdate ? "Update Admit Card" : "Add Admit Card";
    const mode = isUpdate ? "update" : "add";
    const initialValues = {
      title: admitCardTitle,
      url: admitCardUrl,
      description: admitCardDesc,
    };
    return (
      <div className="bg-white border rounded-lg p-2 md:p-6 shadow-sm w-full max-w-full">
        <AddAdmitCardForm
          heading={heading}
          mode={mode as any}
          initialValues={initialValues}
          onSubmit={async ({ title, url, description }: { title: string; url: string; description: string }) => {
            if (!showAdmitCardForm) return;
            try {
              let res, result;
              if (editingAdmitCardId) {
                // Update
                res = await fetch('/api/admitcards', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: editingAdmitCardId,
                    title,
                    url,
                    description,
                    date: new Date().toISOString().slice(0, 10)
                  }),
                });
              } else {
                // Add
                res = await fetch('/api/admitcards', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jobId: showAdmitCardForm,
                    title,
                    url,
                    description,
                    date: new Date().toISOString().slice(0, 10)
                  }),
                });
              }
              try {
                result = await res.json();
              } catch (jsonErr) {
                const text = await res.text();
                alert('Server error: ' + text);
                return;
              }
              if (res.ok && result.success) {
                alert(editingAdmitCardId ? 'Admit card updated!' : 'Admit card added!');
                // Refetch admit cards
                try {
                  const resAdmitCards = await fetch('/data.json');
                  const dataAdmitCards = await resAdmitCards.json();
                  setAdmitCards(dataAdmitCards.admitCards || []);
                } catch {}
              } else {
                alert('Failed to save admit card: ' + (result.error || res.statusText));
              }
            } catch (err) {
              alert('Error saving admit card: ' + err);
            }
            setShowAdmitCardForm(null);
            setAdmitCardTitle("");
            setAdmitCardUrl("");
            setAdmitCardDesc("");
            setEditingAdmitCardId(null);
          }}
          onCancel={() => {
            setShowAdmitCardForm(null);
            setAdmitCardTitle("");
            setAdmitCardUrl("");
            setAdmitCardDesc("");
            setEditingAdmitCardId(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-2 md:p-6 shadow-sm w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-4 md:mb-6">
        <div>
          <h2 className="text-base md:text-lg lg:text-2xl font-bold text-teal-700">{activeTab === "results"
            ? "Add Result"
            : activeTab === "answerkeys"
              ? "Add Answer Keys"
              : activeTab === "admitcards"
                ? "Admit Cards"
                : "Job Listings"}</h2>
          <div className="text-gray-500 text-xs md:text-sm mt-1">Total Jobs: <span className="font-semibold text-teal-700">{jobs.length}</span></div>
        </div>
        {activeTab === "results" ? (
          <span className="inline-block bg-green-50 text-green-700 font-semibold px-3 py-1 rounded text-xs md:text-sm lg:text-base shadow border border-green-200">
            Total Results Added : {results?.length || 0}
          </span>
        ) : activeTab === "answerkeys" ? (
          <span className="inline-block bg-green-50 text-green-700 font-semibold px-3 py-1 rounded text-xs md:text-sm lg:text-base shadow border border-green-200">
            Total Answer Keys Added : {answerKeys?.length || 0}
          </span>
        ) : activeTab === "admitcards" ? (
          <span className="inline-block bg-green-50 text-green-700 font-semibold px-3 py-1 rounded text-xs md:text-sm lg:text-base shadow border border-green-200">
            Total Admit Cards Added : {admitCards?.length || 0}
          </span>
        ) : (
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-2 md:px-4 lg:px-6 py-1 md:py-2 rounded font-semibold shadow transition text-xs md:text-sm lg:text-base"
            onClick={() => { setEditJob(undefined); setShowForm(true); }}
          >
            + Add New Job
          </button>
        )}
      </div>
      {/* Jobs Table - Always visible, responsive */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border rounded text-[11px] md:text-xs lg:text-sm">
          <thead>
            <tr className="bg-teal-50 text-teal-700">
              <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">S No.</th>
              <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">ID</th>
              <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">Title</th>
              <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">Date</th>
              <th className="py-1 md:py-2 px-1 md:px-2 border-b text-center whitespace-nowrap">Category</th>
              <th className="py-1 md:py-2 px-1 md:px-2 flex gap-1 justify-center flex-wrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobsLoading && ["job","results","answerkeys","admitcards","internships","scholarships","sarkariyojana"].includes(activeTab) ? (
              <tr>
                <td colSpan={6} className="py-4 md:py-6"><JobsShimmer count={6} /></td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 md:py-6 text-gray-400">No jobs available.</td>
              </tr>
            ) : jobs && jobs.length > 0 ? (
              jobs.map((job, idx) => (
              <tr key={job.id ?? ""} className="border-b hover:bg-gray-50 transition">
                <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">{idx + 1}</td>
                <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">
                  {activeTab === "results"
                    ? (results?.find((r: any) => r.jobId === job.id)?.id || job.id)
                    : activeTab === "answerkeys"
                      ? (answerKeys?.find((a: any) => a.jobId === job.id)?.id || job.id)
                    : activeTab === "admitcards"
                      ? (admitCards?.find((a: any) => a.jobId === job.id)?.id || job.id)
                      : job.id}
                </td>
                <td className="py-1 md:py-2 px-1 md:px-2 font-medium text-gray-800 text-center">
                  {activeTab === "results"
                    ? (results?.find((r: any) => r.jobId === job.id)?.title || job.title)
                    : activeTab === "answerkeys"
                      ? (answerKeys?.find((a: any) => a.jobId === job.id)?.title || job.title)
                    : activeTab === "admitcards"
                      ? (admitCards?.find((a: any) => a.jobId === job.id)?.title || job.title)
                      : job.title
                  }
                </td>
                <td className="py-1 md:py-2 px-1 md:px-2 text-center">
                  {activeTab === "results"
                    ? (results?.find((r: any) => r.jobId === job.id)?.date || (job as {date?: string}).date || "")
                    : activeTab === "answerkeys"
                      ? (answerKeys?.find((a: any) => a.jobId === job.id)?.date || (job as {date?: string}).date || "")
                    : activeTab === "admitcards"
                      ? (admitCards?.find((a: any) => a.jobId === job.id)?.date || (job as {date?: string}).date || "")
                      : (job as {date?: string}).date || ""
                  }
                </td>
                <td className="py-1 md:py-2 px-1 md:px-2 capitalize text-center">{job.category === 'state%20gov' ? 'State Gov' : job.category}</td>
                <td className="py-1 md:py-2 px-1 md:px-2 flex gap-1 justify-center flex-wrap">
                  {activeTab === "results" ? (
                    (() => {
                      // Find if this job has a result already
                      const result = results?.find((r: any) => r.jobId === job.id);
                      if (result) {
                        return (
                          <div className="flex gap-1">
                            <button
                              className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-[10px] md:text-xs lg:text-sm"
                              onClick={() => {
                                setEditJob(undefined);
                                setShowForm(true);
                                setAddResultJobId(job.id);
                                setEditResultId(result.id);
                                setEditResultInitial({
                                  title: result.title,
                                  url: result.url,
                                  description: result.description,
                                });
                                setFormMode('update');
                              }}
                            >
                              Update
                            </button>
                            <button
                              className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-[10px] md:text-xs lg:text-sm"
                              onClick={async () => {
                                if (!window.confirm('Are you sure you want to delete this result?')) return;
                                try {
                                  const res = await fetch(`/api/results?id=${encodeURIComponent(result.id)}`, { method: 'DELETE' });
                                  const data = await res.json();
                                  if (res.ok && data.success) {
                                    alert('Result deleted!');
                                    // Refetch jobs and results
                                    try {
                                      const resJobs = await fetch('/api/jobs');
                                      const dataJobs = await resJobs.json();
                                      setJobs(dataJobs.jobs);
                                      const resResults = await fetch('/data.json');
                                      const dataResults = await resResults.json();
                                      setResults(dataResults.results);
                                    } catch {}
                                  } else {
                                    alert('Failed to delete result: ' + (data.error || res.statusText));
                                  }
                                } catch (err) {
                                  alert('Delete failed: ' + err);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition text-[10px] md:text-xs lg:text-sm"
                          onClick={() => { setEditJob(undefined); setShowForm(true); setAddResultJobId(job.id); }}
                        >
                          + Add Result
                        </button>
                      );
                    })()
                  ) : activeTab === "answerkeys" ? (
                    (() => {
                      const answerKey = answerKeys?.find((a: any) => a.jobId === job.id);
                      if (answerKey) {
                        return (
                          <div className="flex gap-1">
                            <button
                              className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-[10px] md:text-xs lg:text-sm"
                              onClick={() => {
                                setShowAnswerKeyForm(job.id ?? null);
                                setAnswerKeyTitle(answerKey.title);
                                setAnswerKeyUrl(answerKey.url);
                                setAnswerKeyDesc(answerKey.description);
                                setEditingAnswerKeyId(answerKey.id);
                              }}
                            >
                              Update
                            </button>
                            <button
                              className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-[10px] md:text-xs lg:text-sm"
                              onClick={async () => {
                                if (!window.confirm('Are you sure you want to delete this answer key?')) return;
                                try {
                                  const res = await fetch(`/api/answerkeys?id=${encodeURIComponent(answerKey.id)}`, { method: 'DELETE' });
                                  const data = await res.json();
                                  if (res.ok && data.success) {
                                    alert('Answer key deleted!');
                                    // Refetch answer keys
                                    try {
                                      const resResults = await fetch('/data.json');
                                      const dataResults = await resResults.json();
                                      setAnswerKeys(dataResults.answerKeys || []);
                                    } catch {}
                                  } else {
                                    alert('Failed to delete answer key: ' + (data.error || res.statusText));
                                  }
                                } catch (err) {
                                  alert('Delete failed: ' + err);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition text-[10px] md:text-xs lg:text-sm"
                          onClick={() => setShowAnswerKeyForm(job.id ?? null)}
                        >
                          + Add Answer Key
                        </button>
                      );
                    })()
                  ) : activeTab === "admitcards" ? (
                    (() => {
                      const admitCard = admitCards?.find((a: any) => a.jobId === job.id);
                      if (admitCard) {
                        return (
                          <div className="flex gap-1">
                            <button
                              className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-[10px] md:text-xs lg:text-sm"
                              onClick={() => {
                                setShowAdmitCardForm(job.id ?? null);
                                setAdmitCardTitle(admitCard.title);
                                setAdmitCardUrl(admitCard.url);
                                setAdmitCardDesc(admitCard.description);
                                setEditingAdmitCardId(admitCard.id);
                              }}
                            >
                              Update
                            </button>
                            <button
                              className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-[10px] md:text-xs lg:text-sm"
                              onClick={async () => {
                                if (!window.confirm('Are you sure you want to delete this admit card?')) return;
                                try {
                                  const res = await fetch(`/api/admitcards?id=${encodeURIComponent(admitCard.id)}`, { method: 'DELETE' });
                                  const data = await res.json();
                                  if (res.ok && data.success) {
                                    alert('Admit card deleted!');
                                    // Refetch admit cards
                                    try {
                                      const resResults = await fetch('/data.json');
                                      const dataResults = await resResults.json();
                                      setAdmitCards(dataResults.admitCards || []);
                                    } catch {}
                                  } else {
                                    alert('Failed to delete admit card: ' + (data.error || res.statusText));
                                  }
                                } catch (err) {
                                  alert('Delete failed: ' + err);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition text-[10px] md:text-xs lg:text-sm"
                          onClick={() => setShowAdmitCardForm(job.id ?? null)}
                        >
                          + Add Admit Card
                        </button>
                      );
                    })()
                  ) : (
                    <>
                      <button
                        className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-[10px] md:text-xs lg:text-sm"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-1 md:px-2 py-0.5 md:py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-[10px] md:text-xs lg:text-sm"
                        onClick={() => handleDelete(job.id as string)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import InternshipAdminPanel from "@/components/internship-admin-panel";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("sarkari_admin_logged_in") !== "yes") {
      router.replace("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("sarkari_admin_logged_in");
    router.replace("/admin/login");
  };

  const [data, setData] = useState<{
    jobs?: any[];
    admitCards?: any[];
    answerKeys?: any[];
    results?: any[];
    internships?: any[];
    sarkariYojana?: any[];
    scholarshipTests?: any[];
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/data.json');
        const data = await res.json();
        setData(data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 py-6 px-4 min-h-screen">
        {/* Sidebar Content (inline) */}
        <div className="flex items-center gap-2 mb-8">
          <span className="rounded-full w-12 h-8 flex items-center justify-center text-xl"><img src="/favicon.svg" alt="" /></span>
          <span className="font-bold text-xl text-teal-700 tracking-wide">Admin</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full text-left px-3 py-2 rounded transition font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${activeTab === item.key ? 'bg-teal-100 text-teal-700' : ''}`}
                  onClick={() => {
                    setActiveTab(item.key);
                    setSidebarOpen(false); // close drawer on nav click (mobile)
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-8 text-xs text-gray-400">Sarkari Babu Admin &copy; {new Date().getFullYear()}</div>
      </aside>
      {/* Sidebar Drawer - Mobile */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
            onClick={() => {
              setSidebarOpen(false);
              document.body.style.overflow = '';
            }}
            aria-label="Close sidebar"
          />
          {/* Drawer */}
          <aside className="fixed top-0 left-0 bottom-0 w-64 max-w-[80vw] bg-white border-r border-gray-200 shadow-2xl z-40 flex flex-col py-6 px-4 animate-slide-in min-h-screen focus:outline-none">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-teal-700 focus:outline-none"
              aria-label="Close sidebar"
              onClick={() => {
                setSidebarOpen(false);
                document.body.style.overflow = '';
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="pt-8" />
            {/* Sidebar Content (inline) */}
            <div className="flex items-center gap-2 mb-8">
              <span className="rounded-full w-12 h-8 flex items-center justify-center text-xl"><img src="/favicon.svg" alt="" /></span>
              <span className="font-bold text-xl text-teal-700 tracking-wide">Admin</span>
            </div>
            <nav className="flex-1">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded transition font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${activeTab === item.key ? 'bg-teal-100 text-teal-700' : ''}`}
                      onClick={() => {
                        setActiveTab(item.key);
                        setSidebarOpen(false); // close drawer on nav click (mobile)
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2 rounded transition mt-4"
              onClick={handleLogout}
            >Logout</button>
            <div className="mt-auto pt-8 text-xs text-gray-400">Sarkari Babu Admin &copy; {new Date().getFullYear()}</div>
          </aside>
        </>
      )}
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 transition-all duration-200 min-w-0 overflow-auto">
        {/* Dashboard Cards */}
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-teal-700">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-6">
              {[
                {
                  label: "Jobs Posted",
                  value: Array.isArray(data.jobs) ? data.jobs.length : 0,
                  icon: (
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
                  ),
                  color: "bg-teal-50 border-teal-500",
                  subtitle: "Job Posted",
                },
                {
                  label: "Admit Cards",
                  value: Array.isArray(data.admitCards) ? data.admitCards.length : 0,
                  icon: (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" /></svg>
                  ),
                  color: "bg-blue-50 border-blue-500",
                  subtitle: "Admit Card Posted",
                },
                {
                  label: "Answer Keys",
                  value: Array.isArray(data.answerKeys) ? data.answerKeys.length : 0,
                  icon: (
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M10 16l5-5-1.5-1.5L10 13l-1.5-1.5L7 13l3 3z" /></svg>
                  ),
                  color: "bg-yellow-50 border-yellow-500",
                  subtitle: "Answer Key Posted",
                },
                {
                  label: "Results",
                  value: Array.isArray(data.results) ? data.results.length : 0,
                  icon: (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ),
                  color: "bg-green-50 border-green-500",
                  subtitle: "Result Posted",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`border-l-4 ${card.color} rounded-lg shadow-sm p-5 flex items-center gap-4`}
                >
                  <div className="bg-white rounded-full p-2 shadow-sm border">
                    {card.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                    <div className="text-gray-500 text-sm font-medium">{card.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-10">
              {[
                {
                  label: "Internships",
                  value: Array.isArray(data.internships) ? data.internships.length : 0,
                  icon: (
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></svg>
                  ),
                  color: "bg-indigo-50 border-indigo-500",
                  subtitle: "Internship Posted",
                },
                {
                  label: "Sarkari Yojana",
                  value: Array.isArray(data.sarkariYojana) ? data.sarkariYojana.length : 0,
                  icon: (
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 4.01 13.71 5.58C14.51 4.01 16.18 3 17.92 3C20.99 3 23.42 5.42 23.42 8.5C23.42 13.5 16 21 16 21H12Z" /></svg>
                  ),
                  color: "bg-pink-50 border-pink-500",
                  subtitle: "Yojana Posted",
                },
                {
                  label: "Scholarships",
                  value: Array.isArray(data.scholarshipTests) ? data.scholarshipTests.length : 0,
                  icon: (
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M12 8v8M8 12h8" /></svg>
                  ),
                  color: "bg-orange-50 border-orange-500",
                  subtitle: "Scholarship Posted",
                },
                {
                  label: "Total",
                  value: [
                    data.jobs?.length || 0,
                    data.admitCards?.length || 0,
                    data.answerKeys?.length || 0,
                    data.results?.length || 0,
                    data.internships?.length || 0,
                    data.sarkariYojana?.length || 0,
                    data.scholarshipTests?.length || 0,
                  ].reduce((a, b) => a + b, 0),
                  icon: (
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12 8v8" /></svg>
                  ),
                  color: "bg-gray-50 border-gray-400",
                  subtitle: "Total Entries",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`border-l-4 ${card.color} rounded-lg shadow-sm p-5 flex items-center gap-4`}
                >
                  <div className="bg-white rounded-full p-2 shadow-sm border">
                    {card.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                    <div className="text-gray-500 text-sm font-medium">{card.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2 text-teal-700">Welcome to the Sarkari Babu Admin Dashboard</h2>
              <p className="text-gray-600">Manage jobs, results, users, and more from this professional dashboard. Use the sidebar to navigate between different sections.</p>
            </div>
          </>
        )}
        {(activeTab === "job" || activeTab === "results") && (
          <JobAdminPanel activeTab={activeTab} />
        )}
        {activeTab === "answerkeys" && (
          <JobAdminPanel activeTab="answerkeys" />
        )}
        {activeTab === "scholarships" && (
          <ScholarshipAdminPanel />
        )}
        {activeTab === "admitcards" && (
          <JobAdminPanel activeTab="admitcards" />
        )}
        {activeTab === "internships" && (
          <InternshipAdminPanel />
        )}
        {activeTab === "sarkariyojana" && (
          <YojanaAdminPanel activeTab={activeTab} />
        )}
        {activeTab === "settings" && (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow"
            >
              Logout
            </button>
          </div>
        )}
        {activeTab !== "dashboard" && activeTab !== "job" && activeTab !== "results" && activeTab !== "answerkeys" && activeTab !== "admitcards" && activeTab !== "internships" && activeTab !== "scholarships" && activeTab !== "sarkariyojana" && activeTab !== "settings" && (
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">{navItems.find(i => i.key === activeTab)?.label}</h2>
            <p className="text-gray-500">This section is under construction.</p>
          </div>
        )}
      </main>
    </div>
  );
}