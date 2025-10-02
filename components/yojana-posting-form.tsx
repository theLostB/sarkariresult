"use client";
import { useState, useEffect } from "react";

interface YojanaFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

interface YojanaPostingFormValues {
  title: string;
  category: string;
  yojanaDescription: string;
  applyOnlineUrl: string;
  yojanaNotificationUrl: string;
  officialWebsiteUrl: string;
  startDate: string;
  lastDate: string;
  totalVacancies: string;
  vacancyGeneral: string;
  vacancyOBC: string;
  vacancySC: string;
  vacancyST: string;
  vacancyEWS: string;
  vacancyPwD: string;
  howToApplyUrl: string;
  [key: string]: string;
}

const defaultValues = {
  title: "",
  category: "",
  yojanaDescription: "",
  applyOnlineUrl: "",
  yojanaNotificationUrl: "",
  officialWebsiteUrl: "",
  startDate: "",
  lastDate: "",
  totalVacancies: "",
  vacancyGeneral: "",
  vacancyOBC: "",
  vacancySC: "",
  vacancyST: "",
  vacancyEWS: "",
  vacancyPwD: "",
  howToApplyUrl: "",
};

export default function YojanaPostingForm({ initialValues, onSubmit, onCancel }: YojanaFormProps) {
  // --- Add Benefits dynamic fields ---
  function extractBenefits(obj: any): string[] {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      const val = obj?.[`benefit${i}`] || '';
      if (val || i <= 4) arr.push(val);
    }
    // Always at least 4 fields
    while (arr.length < 4) arr.push('');
    return arr;
  }

  // --- Add Documents dynamic fields ---
  function extractDocuments(obj: any): string[] {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      const val = obj?.[`document${i}`] || '';
      if (val || i <= 4) arr.push(val);
    }
    // Always at least 4 fields
    while (arr.length < 4) arr.push('');
    return arr;
  }

  // --- New Eligibility Criteria dynamic fields ---
  function extractCriteria(obj: any): string[] {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      const val = obj?.[`criteria${i}`] || '';
      if (val || i <= 4) arr.push(val);
    }
    // Always at least 4 fields
    while (arr.length < 4) arr.push('');
    return arr;
  }

  const [form, setForm] = useState<YojanaPostingFormValues>({ ...defaultValues, ...initialValues });
  const [benefits, setBenefits] = useState<string[]>(extractBenefits(initialValues || {}));
  const [documents, setDocuments] = useState<string[]>(extractDocuments(initialValues || {}));
  const [criteria, setCriteria] = useState<string[]>(extractCriteria(initialValues || {}));
  const editMode = !!initialValues;

  // Helper to render input fields
  function renderInputField(
    label: string,
    name: string,
    placeholder?: string,
    type: 'input' | 'textarea' = 'input',
    required: boolean = false
  ) {
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={form[name] ?? ''}
            onChange={handleChange}
            placeholder={placeholder}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[40px] resize-y"
          />
        ) : (
          <input
            id={name}
            name={name}
            value={form[name] ?? ''}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            type="text"
          />
        )}
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Benefits handlers
  function handleBenefitChange(idx: number, value: string) {
    setBenefits(prev => prev.map((b, i) => (i === idx ? value : b)));
  }
  function addBenefitField() {
    setBenefits(prev => prev.length < 10 ? [...prev, ''] : prev);
  }
  function removeBenefitField(idx: number) {
    setBenefits(prev => prev.length > 4 ? prev.filter((_, i) => i !== idx) : prev);
  }

  // Documents handlers
  function handleDocumentChange(idx: number, value: string) {
    setDocuments(prev => prev.map((d, i) => (i === idx ? value : d)));
  }
  function addDocumentField() {
    setDocuments(prev => prev.length < 10 ? [...prev, ''] : prev);
  }
  function removeDocumentField(idx: number) {
    setDocuments(prev => prev.length > 4 ? prev.filter((_, i) => i !== idx) : prev);
  }

  // Criteria handlers
  function handleCriteriaChange(idx: number, value: string) {
    setCriteria(prev => prev.map((c, i) => (i === idx ? value : c)));
  }
  function addCriteriaField() {
    setCriteria(prev => prev.length < 10 ? [...prev, ''] : prev);
  }
  function removeCriteriaField(idx: number) {
    setCriteria(prev => prev.length > 4 ? prev.filter((_, i) => i !== idx) : prev);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new object with all form data
    const formData = {
      ...form,
      // Add benefits as benefit1, benefit2, etc.
      ...benefits.reduce((acc, benefit, idx) => {
        acc[`benefit${idx + 1}`] = benefit;
        return acc;
      }, {} as Record<string, string>),
      // Add documents as document1, document2, etc.
      ...documents.reduce((acc, doc, idx) => {
        acc[`document${idx + 1}`] = doc;
        return acc;
      }, {} as Record<string, string>),
      // Add criteria as criteria1, criteria2, etc.
      ...criteria.reduce((acc, criterion, idx) => {
        acc[`criteria${idx + 1}`] = criterion;
        return acc;
      }, {} as Record<string, string>),
    };

    if (!editMode) {
      await onSubmit(formData);
      // Trigger notification only on add
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Sarkari Yojana Posted!',
          body: `${form.title || 'A new yojana'} has been added. Check it now!`,
          url: '/'
        })
      });
    } else {
      await onSubmit(formData);
    }
    setForm(defaultValues);
  };

  // When editing, update benefits, documents, criteria if initialValues change (for Edit mode)
  // This effect ensures fields are prefilled when editing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setForm({ ...defaultValues, ...initialValues });
    setBenefits(extractBenefits(initialValues || {}));
    setDocuments(extractDocuments(initialValues || {}));
    setCriteria(extractCriteria(initialValues || {}));
  }, [initialValues]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-sm p-4 shadow-sm">

      {/* Basic Information */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Basic Information</h2>
        {renderInputField('Yojana Title', 'title', 'Enter Yojana title', 'input', true)}
        {renderInputField('Yojana Description', 'yojanaDescription', 'Enter detailed Yojana description', 'textarea')}
        {/* Category Dropdown */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">None</option>
            <option value="UPSC">UPSC</option>
            <option value="SSC">SSC</option>
            <option value="Railway">Railway</option>
            <option value="Banking">Banking</option>
            <option value="Defence">Defence</option>
            <option value="Sate Gov">State Govt.</option>
            <option value="Central Govt.">Central Govt.</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Judiciary">Judiciary</option>
            <option value="PSU">PSU</option>
            <option value="Post Office">Post Office</option>
            <option value="Institutions">Institutions</option>
            <option value="Police">Police</option>
            <option value="Engineering">Engineering</option>
            <option value="Medical">Medical</option>
            <option value="UPSSSC">UPSSSC</option>
            <option value="UPPSC">UPPSC</option>
          </select>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Quick Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {renderInputField('Apply Online URL', 'applyOnlineUrl', 'https://example.com/apply')}
          {renderInputField('Yojana Notification URL', 'yojanaNotificationUrl', 'https://example.com/notification')}
          {renderInputField('Official Website URL', 'officialWebsiteUrl', 'https://example.com')}
          
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Benefits</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={`Benefit ${idx + 1}`}
                value={benefit}
                onChange={e => handleBenefitChange(idx, e.target.value)}
              />
              {benefits.length > 4 && (
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 px-2"
                  onClick={() => removeBenefitField(idx)}
                  title="Remove this benefit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {benefits.length < 10 && (
          <div className="flex justify-start mt-2">
            <button
              type="button"
              className="border border-teal-400 text-teal-700 px-4 py-1.5 rounded-md font-medium hover:bg-teal-50 transition"
              onClick={addBenefitField}
            >
              + Add Benefit
            </button>
          </div>
        )}
      </section>

      {/* Required Documents */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Required Documents</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {documents.map((document, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={`Document ${idx + 1}`}
                value={document}
                onChange={e => handleDocumentChange(idx, e.target.value)}
              />
              {documents.length > 4 && (
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 px-2"
                  onClick={() => removeDocumentField(idx)}
                  title="Remove this document"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {documents.length < 10 && (
          <div className="flex justify-start mt-2">
            <button
              type="button"
              className="border border-teal-400 text-teal-700 px-4 py-1.5 rounded-md font-medium hover:bg-teal-50 transition"
              onClick={addDocumentField}
            >
              + Add Document
            </button>
          </div>
        )}
      </section>

      {/* Eligibility Criteria */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Eligibility Criteria</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {criteria.map((criterion, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={`Criteria ${idx + 1}`}
                value={criterion}
                onChange={e => handleCriteriaChange(idx, e.target.value)}
              />
              {criteria.length > 4 && (
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 px-2"
                  onClick={() => removeCriteriaField(idx)}
                  title="Remove this criteria"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {criteria.length < 10 && (
          <div className="flex justify-start mt-2">
            <button
              type="button"
              className="border border-teal-400 text-teal-700 px-4 py-1.5 rounded-md font-medium hover:bg-teal-50 transition"
              onClick={addCriteriaField}
            >
              + Add Criteria
            </button>
          </div>
        )}
      </section>

      {/* Important Dates */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Important Dates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInputField('Start Date', 'startDate', 'DD/MM/YYYY')}
          {renderInputField('Last Date', 'lastDate', 'DD/MM/YYYY')}
        </div>
      </section>

      {/* Vacancy Details */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Vacancies</h2>
        {renderInputField('Total Vacancies', 'totalVacancies', '100')}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInputField('General', 'vacancyGeneral', '40')}
          {renderInputField('OBC', 'vacancyOBC', '27')}
          {renderInputField('SC', 'vacancySC', '15')}
          {renderInputField('ST', 'vacancyST', '8')}
          {renderInputField('EWS', 'vacancyEWS', '10')}
          {renderInputField('PwD', 'vacancyPwD', '2')}
        </div>
      </section>

      {/* How to Apply */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">How to Apply</h2>
        {renderInputField('Official Website URL', 'howToApplyUrl', 'https://example.com')}
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t mt-8">
        {onCancel && (
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold border border-gray-300 transition"
            onClick={onCancel}
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded font-semibold shadow transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}
