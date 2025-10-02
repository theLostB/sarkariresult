'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

export interface ScholarshipPostingFormValues {
  category: string;
  title: string;
  jobDescription: string;
  applyOnlineUrl: string;
  scholarshipNotificationUrl: string;
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

interface ScholarshipPostingFormProps {
  onCancel?: () => void;
  onSave?: (data: ScholarshipPostingFormValues) => void;
  initialData?: Partial<ScholarshipPostingFormValues>;
}

export default function ScholarshipPostingForm({ onCancel, onSave, initialData }: ScholarshipPostingFormProps) {
  // Eligibility posts state
  const [eligibilityPosts, setEligibilityPosts] = React.useState([
    { name: '', eligibility: '', ageLimit: '' }
  ]);

  React.useEffect(() => {
    // If editing, prefill eligibility posts from initialData if present
    const posts: any[] = [];
    for (let i = 1; i <= 10; i++) {
      const name = initialData?.[`postName${i}` as keyof ScholarshipPostingFormValues] || '';
      const eligibility = initialData?.[`postEligibility${i}` as keyof ScholarshipPostingFormValues] || '';
      const ageLimit = initialData?.[`postAgeLimit${i}` as keyof ScholarshipPostingFormValues] || '';
      if (name || eligibility || ageLimit) {
        posts.push({ name, eligibility, ageLimit });
      }
    }
    if (posts.length > 0) setEligibilityPosts(posts);
    else setEligibilityPosts([{ name: '', eligibility: '', ageLimit: '' }]);
  }, [initialData]);

  // Handler for eligibility post field change
  const handleEligibilityChange = (idx: number, field: 'name' | 'eligibility' | 'ageLimit', value: string) => {
    setEligibilityPosts(prev => {
      const arr = [...prev];
      arr[idx][field] = value;
      return arr;
    });
  };

  // Add eligibility post
  const addEligibilityPost = () => {
    setEligibilityPosts(prev => [...prev, { name: '', eligibility: '', ageLimit: '' }]);
  };

  // Remove eligibility post
  const removeEligibilityPost = (idx: number) => {
    setEligibilityPosts(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  };

  const { register, handleSubmit: handleFormSubmit, formState: { errors }, getValues, reset } = useForm<ScholarshipPostingFormValues>({
    defaultValues: initialData as ScholarshipPostingFormValues,
  });

  const editMode = !!initialData;

  const onSubmit = async (data: ScholarshipPostingFormValues) => {
    // Add eligibility posts data to form values
    eligibilityPosts.forEach((post, idx) => {
      data[`postName${idx + 1}` as keyof ScholarshipPostingFormValues] = post.name;
      data[`postEligibility${idx + 1}` as keyof ScholarshipPostingFormValues] = post.eligibility;
      data[`postAgeLimit${idx + 1}` as keyof ScholarshipPostingFormValues] = post.ageLimit;
    });
    if (onSave) onSave(data);
  };

  const handleFormSubmitWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMode) {
      await onSubmit(getValues());
      // Trigger notification only on add
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Scholarship Posted!',
          body: `${getValues().title || 'A new scholarship'} has been added. Check it now!`,
          url: '/'
        })
      });
    } else {
      await onSubmit(getValues());
    }
    reset();
  };

  // Utility to render input fields (copied from job-posting-form for parity)
  function renderInputField(
    label: string,
    name: keyof ScholarshipPostingFormValues,
    placeholder: string,
    type: 'text' | 'textarea' = 'text',
    required = false
  ) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {type === 'textarea' ? (
          <textarea
            {...register(name, { required })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder={placeholder}
            rows={4}
          />
        ) : (
          <input
            {...register(name, { required })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder={placeholder}
            type={type}
          />
        )}
        {errors[name] && (
          <span className="text-xs text-red-500">This field is required</span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmitWrapper} className="space-y-6 bg-white border rounded-sm p-4 shadow-sm">
      {/* Basic Information */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Basic Information</h2>
        {renderInputField('Scholarship Title', 'title', 'Enter Scholarship title')}
        {renderInputField('Scholarship Description', 'jobDescription', 'Enter detailed Scholarship description', 'textarea')}
        {/* Category Dropdown */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            defaultValue=""
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
          {renderInputField('Scholarship Notification URL', 'scholarshipNotificationUrl', 'https://example.com/notification')}
          {renderInputField('Official Website URL', 'officialWebsiteUrl', 'https://example.com')}
          
        </div>
      </section>

     
      {/* Important Dates */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Important Dates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInputField('Start Date', 'startDate', 'DD/MM/YYYY')}
          {renderInputField('Last Date', 'lastDate', 'DD/MM/YYYY')}
          {renderInputField('Last Date to Pay Fee', 'lastDateFee', 'DD/MM/YYYY')}
          {renderInputField('Admit Card Date', 'admitCardDate', 'DD/MM/YYYY')}
          {renderInputField('Exam Date', 'examDate', 'DD/MM/YYYY')}
          {renderInputField('Result Date', 'resultDate', 'DD/MM/YYYY')}
        </div>
      </section>

      {/* Application Fee */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Application Fee</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInputField('General/EWS Fee', 'feeGeneral', '₹500')}
          {renderInputField('SC/ST/PwD Fee', 'feeSCST', '₹250')}
          {renderInputField('OBC Fee', 'feeOBC', '₹0')}
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

      {/* Eligibility Criteria */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Eligibility Criteria</h2>
        <div className="space-y-4">
          {eligibilityPosts.map((post, idx) => (
            <div key={idx} className="grid md:grid-cols-3 gap-6 bg-gray-50 border border-gray-200 rounded-lg p-5 relative">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-700 mb-1" htmlFor={`postname-${idx}`}>Post Name</label>
                <input
                  id={`postname-${idx}`}
                  type="text"
                  className="input input-bordered w-full text-sm py-2 px-3 rounded-md focus:ring-teal-500 focus:border-transparent"
                  placeholder={`Post Name${eligibilityPosts.length > 1 ? ` (${idx + 1})` : ''}`}
                  value={post.name}
                  onChange={e => handleEligibilityChange(idx, 'name', e.target.value)}

                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-700 mb-1" htmlFor={`eligibility-${idx}`}>Eligibility</label>
                <textarea
                  id={`eligibility-${idx}`}
                  className="input input-bordered w-full text-sm py-2 px-3 rounded-md focus:ring-teal-500 focus:border-transparent min-h-[40px] resize-y"
                  placeholder="Eligibility (e.g. B.Tech in CS)"
                  value={post.eligibility}
                  onChange={e => handleEligibilityChange(idx, 'eligibility', e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-700 mb-1" htmlFor={`agelimit-${idx}`}>Age Limit</label>
                <input
                  id={`agelimit-${idx}`}
                  type="text"
                  className="input input-bordered w-full text-sm py-2 px-3 rounded-md focus:ring-teal-500 focus:border-transparent"
                  placeholder="Age Limit (e.g. 18-27 years)"
                  value={post.ageLimit}
                  onChange={e => handleEligibilityChange(idx, 'ageLimit', e.target.value)}
                />
              </div>
              {eligibilityPosts.length > 1 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600"
                  onClick={() => removeEligibilityPost(idx)}
                  title="Remove this post"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {eligibilityPosts.length < 10 && (
          <div className="flex justify-start mt-4">
            <button
              type="button"
              className="border border-teal-400 text-teal-700 px-4 py-1.5 rounded-md font-medium hover:bg-teal-50 transition "
              onClick={addEligibilityPost}
            >
              + Add Another Post
            </button>
          </div>
        )}
      </section>

      {/* Selection Process */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Selection Process</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {renderInputField('Step 1', 'selectionProcess1', 'Written Examination')}
          {renderInputField('Step 2', 'selectionProcess2', 'Personal Interview')}
          {renderInputField('Step 3', 'selectionProcess3', 'Document Verification')}
          {renderInputField('Step 4', 'selectionProcess4', 'Medical Examination')}
        </div>
      </section>

      {/* How to Apply */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">How to Apply</h2>
        {renderInputField('Official Website URL', 'howToApplyUrl', 'https://example.com')}
      </section>

      {/* Coaching Institutes */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Coaching Institutes</h2>
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="grid md:grid-cols-2 gap-4 mb-4">
            {renderInputField(`Institute ${index} Name`, `coachingName${index}` as keyof ScholarshipPostingFormValues, 'Institute name', 'text', false)}
            {renderInputField(`Institute ${index} URL`, `coachingUrl${index}` as keyof ScholarshipPostingFormValues, 'https://example.com', 'text', false)}
          </div>
        ))}
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
