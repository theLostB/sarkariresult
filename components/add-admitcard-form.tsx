import React, { useState, useEffect } from "react";

interface AddAdmitCardFormProps {
  onSubmit: (data: { title: string; url: string; description: string }) => void;
  onCancel: () => void;
  initialValues?: { title: string; url: string; description: string };
  mode?: 'add' | 'update';
  heading?: string;
}

const AddAdmitCardForm: React.FC<AddAdmitCardFormProps> = ({ onSubmit, onCancel, initialValues, mode = 'add', heading }) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [url, setUrl] = useState(initialValues?.url || "");
  const [description, setDescription] = useState(initialValues?.description || "");

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || "");
      setUrl(initialValues.url || "");
      setDescription(initialValues.description || "");
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'add') {
      onSubmit({ title, url, description });
      // Trigger notification only on add
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Admit Card Posted!',
          body: `${title || 'A new admit card'} has been added. Check it now!`,
          url: '/'
        })
      });
    } else {
      onSubmit({ title, url, description });
    }
    setTitle("");
    setUrl("");
    setDescription("");
  };

  return (
    <div className="bg-white border rounded-lg p-4 md:p-8 shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-lg md:text-2xl font-bold mb-4 text-teal-700">{heading || (mode === 'add' ? 'Add Admit Card' : 'Update Admit Card')}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block font-medium mb-1">Admit Card Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={title}
            onChange={e => setTitle(e.target.value)}

          />
        </div>
        <div>
          <label className="block font-medium mb-1">Download Admit Card URL</label>
          <input
            type="url"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={url}
            onChange={e => setUrl(e.target.value)}

          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={description}
            onChange={e => setDescription(e.target.value)}

          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded font-semibold shadow"
          >{mode === 'add' ? 'Add Admit Card' : 'Save'}</button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold"
            onClick={onCancel}
          >Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmitCardForm;
