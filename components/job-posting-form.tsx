'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

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
  // New for dynamic eligibility posts
  [key: `postName${number}`]: string;
  [key: `postEligibility${number}`]: string;
  [key: `postAgeLimit${number}`]: string;
}


interface JobPostingFormProps {
  onCancel?: () => void;
  onSave?: (data: JobPostingFormValues) => void;
  initialData?: Partial<JobPostingFormValues>;
}

export default function JobPostingForm({ onCancel, onSave, initialData }: JobPostingFormProps) {
  // Eligibility posts state
  const [eligibilityPosts, setEligibilityPosts] = React.useState([
    { name: '', eligibility: '', ageLimit: '' }
  ]);

  React.useEffect(() => {
    // If editing, prefill eligibility posts from initialData if present
    const posts: any[] = [];
    for (let i = 1; i <= 10; i++) {
      const name = initialData?.[`postName${i}` as keyof JobPostingFormValues] || '';
      const eligibility = initialData?.[`postEligibility${i}` as keyof JobPostingFormValues] || '';
      const ageLimit = initialData?.[`postAgeLimit${i}` as keyof JobPostingFormValues] || '';
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

  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<JobPostingFormValues>({
    defaultValues: initialData as JobPostingFormValues,
  });

  // Reset form values when initialData changes (for edit mode)
  React.useEffect(() => {
    async function prefillCoaching() {
      if (initialData && initialData.title) {
        // Dynamically import to avoid SSR issues
        const { getCoachingInstitutesForTitle } = await import('../utils/coachingInstitutes');
        const institutes = getCoachingInstitutesForTitle(initialData.title);
        if (institutes && institutes.length > 0) {
          // Only prefill if not already present
          const newData: Record<string, any> = { ...initialData };
          for (let i = 0; i < 5; i++) {
            if (!newData[`coachingName${i+1}`] && institutes[i]) {
              newData[`coachingName${i+1}`] = institutes[i].name;
            }
            if (!newData[`coachingUrl${i+1}`] && institutes[i]) {
              newData[`coachingUrl${i+1}`] = institutes[i].url;
            }
          }
          reset(newData as JobPostingFormValues);
          return;
        }
      }
      if (initialData) {
        reset(initialData);
      }
    }
    prefillCoaching();
  }, [initialData, reset]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper: get placeholder for a field name
  const fieldPlaceholders: { [K in keyof JobPostingFormValues]?: string } = {
    category: '',
    title: 'Enter job title',
    jobDescription: 'Enter detailed job description',
    applyOnlineUrl: 'https://example.com/apply',
    jobNotificationUrl: 'https://example.com/notification',
    officialWebsiteUrl: 'https://example.com',
    

    startDate: 'DD/MM/YYYY',
    lastDate: 'DD/MM/YYYY',
    lastDateFee: 'DD/MM/YYYY',
    admitCardDate: 'DD/MM/YYYY',
    examDate: 'DD/MM/YYYY',
    resultDate: 'DD/MM/YYYY',
    feeGeneral: '₹500',
    feeSCST: '₹250',
    feeOBC: '₹0',
    totalVacancies: '100',
    vacancyGeneral: '40',
    vacancyOBC: '27',
    vacancySC: '15',
    vacancyST: '8',
    vacancyEWS: '10',
    vacancyPwD: '2',
    ageLimit: '21-30 years',
    educationQualification: "Bachelor's degree with minimum 60% marks",
    selectionProcess1: 'Written Examination',
    selectionProcess2: 'Personal Interview',
    selectionProcess3: 'Document Verification',
    selectionProcess4: 'Medical Examination',
    howToApplyUrl: 'https://example.com',
    coachingName1: '',
    coachingUrl1: '',
    coachingName2: '',
    coachingUrl2: '',
    coachingName3: '',
    coachingUrl3: '',
    coachingName4: '',
    coachingUrl4: '',
    coachingName5: '',
    coachingUrl5: '',
  };

  const onSubmit: SubmitHandler<JobPostingFormValues> = async (data) => {
    // For every field, if empty, use blank string
    const filledData = { ...data };
    (Object.keys(filledData) as (keyof JobPostingFormValues)[]).forEach((key) => {
      if (filledData[key] === undefined || filledData[key] === null) {
        filledData[key] = '';
      }
    });
    // Eligibility posts flatten
    // Ab sabhi eligibility posts (blank ya filled) save hongi
    eligibilityPosts.forEach((post, i) => {
      filledData[`postName${i + 1}` as keyof JobPostingFormValues] = post.name || "";
      filledData[`postEligibility${i + 1}` as keyof JobPostingFormValues] = post.eligibility || "";
      filledData[`postAgeLimit${i + 1}` as keyof JobPostingFormValues] = post.ageLimit || "";
    });
    // Remove leftover eligibility post fields if any
    for (let i = eligibilityPosts.length + 1; i <= 10; i++) {
      filledData[`postName${i}` as keyof JobPostingFormValues] = "";
      filledData[`postEligibility${i}` as keyof JobPostingFormValues] = "";
      filledData[`postAgeLimit${i}` as keyof JobPostingFormValues] = "";
    }

    // --- Ensure fee fields have a single '₹' prefix ---
    ['feeGeneral', 'feeSCST', 'feeOBC'].forEach((feeField) => {
      if (filledData[feeField as keyof JobPostingFormValues]) {
        let val = filledData[feeField as keyof JobPostingFormValues] as string;
        // Remove all leading ₹ and add one
        val = val.replace(/^₹+/, '');
        filledData[feeField as keyof JobPostingFormValues] = '₹' + val;
      }
    });

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filledData),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // If backend returns id, use that
        const jobWithId = result.job ? result.job : data;
        // Only send notification if this is an ADD (not edit) form
        const isEdit = !!initialData && Object.keys(initialData).length > 0;
        if (!isEdit) {
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'New Sarkari Job Posted!',
              body: `${filledData.title || 'A new job'} has been added. Check it now!`,
              url: '/'
            })
          });
        }
        if (onSave) onSave(jobWithId);
      } else {
        alert('Failed to post job: ' + (result.error || res.statusText));
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderInputField = (
    label: string, 
    name: keyof JobPostingFormValues, 
    placeholder: string, 
    type: 'text' | 'textarea' = 'text',
    // All fields NOT required
    required = false
  ) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          {...register(name)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          id={name}
          type="text"
          {...register(name)}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white border rounded-sm p-4 shadow-sm">
      {/* Basic Information */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-teal-600">Basic Information</h2>
        {renderInputField('Job Title', 'title', 'Enter job title')}
        {renderInputField('Job Description', 'jobDescription', 'Enter detailed job description', 'textarea')}
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
          {renderInputField('Job Notification URL', 'jobNotificationUrl', 'https://example.com/notification')}
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
            {renderInputField(`Institute ${index} Name`, `coachingName${index}` as keyof JobPostingFormValues, 'Institute name', 'text', false)}
            {renderInputField(`Institute ${index} URL`, `coachingUrl${index}` as keyof JobPostingFormValues, 'https://example.com', 'text', false)}
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