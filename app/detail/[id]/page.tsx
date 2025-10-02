import Link from "next/link"
import { ArrowLeft, Calendar, Download, ExternalLink } from "lucide-react"
import coachingData from "../../../public/coachingInstitutes.json"
import data from "../../../public/data.json"

// Define types for coaching institutes
type Institute = {
  name: string
  url: string
}

type CoachingData = {
  [key: string]: Institute[]
}

// Define types for items
interface Item {
  id: string
  title: string
  date: string
  category?: string
  isNew?: boolean
}

// Define the props type for the page component
interface DetailPageProps {
  params: {
    id: string
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  // Helper function for eligibility formatting
  function renderEligibility(eligibility?: string) {
    if (!eligibility) {
      return (
        <>
          <span className="font-medium">Eligibility:</span>{' '}
          <span className="text-gray-400">N/A</span>
        </>
      );
    }
    return eligibility.split('\n').map((line: string, idx: number) =>
      idx === 0 ? (
        <span key={idx}>
          <span className="font-medium">Eligibility:</span>{' '}{line}
        </span>
      ) : (
        <span key={idx} style={{ display: 'block', paddingLeft: '66px' }}>{line}</span>
      )
    );
  };

  const id = params.id

  // Read data.json
  const allItems: Item[] = [
    ...data.jobs,
    ...data.admitCards,
    ...data.results,
    ...data.answerKeys,
    ...data.sarkariYojana,
    ...data.internships,
    ...data.scholarshipTests
  ]

  // Find the item with matching id
  const matchingItem = allItems.find(item => item.id === id)

  // If it's a job, use all fields from data.json directly
  const isJob = data.jobs.some((job: any) => job.id === id);
  const jobDetail = isJob ? data.jobs.find((job: any) => job.id === id) : null;

  // If it's a result, find the result and its job
  const isResult = data.results.some((result: any) => result.id === id);
  const resultDetail = isResult ? data.results.find((result: any) => result.id === id) : null;
  const resultJob = isResult && resultDetail ? data.jobs.find((job: any) => job.id === resultDetail.jobId) : null;

  // If it's an answer key, find answer key and its parent job
  const isAnswerKey = data.answerKeys.some((ak: any) => ak.id === id);
  const answerKeyDetail = isAnswerKey ? data.answerKeys.find((ak: any) => ak.id === id) : null;
  const answerKeyJob = isAnswerKey && answerKeyDetail ? data.jobs.find((job: any) => job.id === answerKeyDetail.jobId) : null;

  // If it's an admit card, find admit card and its parent job
  const isAdmitCard = data.admitCards.some((ac: any) => ac.id === id);
  const admitCardDetail = isAdmitCard ? data.admitCards.find((ac: any) => ac.id === id) : null;
  const admitCardJob = isAdmitCard && admitCardDetail ? data.jobs.find((job: any) => job.id === admitCardDetail.jobId) : null;

  // If it's a yojana, use all fields from data.json directly
  const isYojana = data.sarkariYojana.some((yojana: any) => yojana.id === id);
  const yojanaDetail = isYojana ? data.sarkariYojana.find((yojana: any) => yojana.id === id) : null;

  // If it's a scholarship test, use all fields from data.json directly
  const isScholarship = data.scholarshipTests.some((s: any) => s.id === id);
  const scholarshipDetail = isScholarship ? data.scholarshipTests.find((s: any) => s.id === id) : null;

  const getDetailData = (id: string) => {
    // If we found a matching item, use its title
    const title = matchingItem?.title || id.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ")

    // Determine if it's a job, admit card, result, or answer key
    let type = "Job Notification"
    if (id.includes("admit")) {
      type = "Admit Card"
    } else if (id.includes("result")) {
      type = "Result"
    } else if (id.includes("answer-key")) {
      type = "Answer Key"
    } else if (id.includes("yojana")) {
      type = "Sarkari Yojana"
    } else if (id.includes("internship")) {
      type = "Internship"
    } else if (id.includes("scholarship")) {
      type = "Scholarship Test"
    }

    // Internship custom detail (only for internships)
    if (type === "Internship") {
      // Find the internship object
      const internship = data.internships.find((item: any) => item.id === id);
      if (internship) {
        const iObj = internship as any;
        // Collect all postName/Eligibility/AgeLimit fields
        const posts = [];
        for (let i = 1; i <= 10; i++) {
          if (iObj[`postName${i}`] || iObj[`postEligibility${i}`] || iObj[`postAgeLimit${i}`]) {
            posts.push({
              name: iObj[`postName${i}`] || 'General',
              eligibility: iObj[`postEligibility${i}`] || '',
              ageLimit: iObj[`postAgeLimit${i}`] || ''
            });
          }
        }
        // If no specific posts found, create one with available data
        if (posts.length === 0 && (iObj.postEligibility1 || iObj.postAgeLimit1)) {
          posts.push({
            name: iObj.postName1 || 'General',
            eligibility: iObj.postEligibility1 || '',
            ageLimit: iObj.postAgeLimit1 || ''
          });
        }
        // Process stipend details
        const stipendDetails = [];
        for (let i = 1; i <= 5; i++) {
          if (iObj[`stipend${i}`] || iObj[`duration${i}`]) {
            stipendDetails.push({
              amount: iObj[`stipend${i}`] || 'Not specified',
              duration: iObj[`duration${i}`] || 'Not specified'
            });
          }
        }

        return {
          title: iObj.title || title,
          shortTitle: iObj.title || title,
          type,
          date: iObj.date || '',
          applicationStartDate: iObj.startDate || '',
          applicationEndDate: iObj.lastDate || '',
          examDate: iObj.examDate || '',
          resultDate: iObj.resultDate || '',
          officialWebsite: iObj.officialWebsiteUrl || '',
          applyLink: iObj.applyOnlineUrl || '',
          downloadLink: iObj.downloadLink || '',
          description: iObj.jobDescription || '',
          posts: posts,
          stipendDetails: stipendDetails.length > 0 ? stipendDetails : null,
          eligibility: posts.length > 0 ? posts.map((p, idx) => `Post ${idx + 1}: ${p.name} | Eligibility: ${p.eligibility} | Age: ${p.ageLimit}`) : [],
          importantDates: [
            iObj.startDate ? { event: "Application Start", date: iObj.startDate } : null,
            iObj.lastDate ? { event: "Last Date", date: iObj.lastDate } : null,
            iObj.examDate ? { event: "Exam Date", date: iObj.examDate } : null,
            iObj.resultDate ? { event: "Result Date", date: iObj.resultDate } : null,
          ].filter(Boolean),
          applicationFee: [],
          selectionProcess: [
            iObj.selectionProcess1,
            iObj.selectionProcess2,
            iObj.selectionProcess3,
            iObj.selectionProcess4
          ].filter((step): step is string => Boolean(step)),
          vacancies: (iObj.totalVacancies || iObj.vacancyGeneral || iObj.vacancyOBC || iObj.vacancySC || iObj.vacancyST || iObj.vacancyEWS || iObj.vacancyPwD)
            ? {
                total: iObj.totalVacancies || '',
                categories: [
                  iObj.vacancyGeneral ? { name: 'General', count: iObj.vacancyGeneral } : null,
                  iObj.vacancyOBC ? { name: 'OBC', count: iObj.vacancyOBC } : null,
                  iObj.vacancySC ? { name: 'SC', count: iObj.vacancySC } : null,
                  iObj.vacancyST ? { name: 'ST', count: iObj.vacancyST } : null,
                  iObj.vacancyEWS ? { name: 'EWS', count: iObj.vacancyEWS } : null,
                  iObj.vacancyPwD ? { name: 'PwD', count: iObj.vacancyPwD } : null,
                ].filter(Boolean)
              }
            : {},
        };
      }
    }
    // ---- DEFAULT (All other types) ----
    // Generate dates based on the ID
    const applicationDate = new Date()
    applicationDate.setDate(applicationDate.getDate() + 30)

    const examDate = new Date()
    examDate.setMonth(examDate.getMonth() + 2)

    const resultDate = new Date()
    resultDate.setMonth(resultDate.getMonth() + 3)

    // Format dates
    const formatDate = (date: Date) => {
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-")
    }

    return {
      title: title,
      shortTitle: title,
      type,
      date: "25-03-2024",
      applicationStartDate: "01-03-2024",
      applicationEndDate: formatDate(applicationDate),
      examDate: formatDate(examDate),
      resultDate: formatDate(resultDate),
      officialWebsite: `https://www.${id.split("-")[0].toLowerCase()}.gov.in`,
      applyLink: `https://www.${id.split("-")[0].toLowerCase()}.gov.in/apply`,
      downloadLink: `https://www.${id.split("-")[0].toLowerCase()}.gov.in/download`,
      description: `The ${title} has released the official notification for ${title} ${type} 2024. Candidates can check all the details like application dates, eligibility, selection process, how to apply, and more information below.`,
      eligibility: [
        "Candidates must be Indian citizens.",
        "Age Limit: 21-30 years (Age relaxation as per government norms).",
        "Educational Qualification: Bachelor's degree from a recognized university.",
        `Candidates must have to check the official notification.`,
      ],
      importantDates: [
        { event: "Online Application Start Date", date: "01-03-2024" },
        { event: "Last Date to Apply Online", date: formatDate(applicationDate) },
        { event: "Last Date to Pay Application Fee", date: formatDate(new Date(applicationDate.getTime() + 86400000)) },
        { event: "Admit Card Release Date", date: formatDate(new Date(examDate.getTime() - 864000000)) },
        { event: "Exam Date", date: formatDate(examDate) },
        { event: "Result Declaration", date: formatDate(resultDate) },
      ],
      applicationFee: [
        { category: "General", fee: "₹500" },
        { category: "SC/ST/PwD", fee: "₹250" },
        { category: "OBC", fee: "₹0 (Exempted)" },
      ],
      selectionProcess: [
        "Written Examination (Objective Type)",
        "Skill Test/Physical Test (if applicable)",
        "Document Verification",
        "Medical Examination",
      ].filter((step): step is string => Boolean(step)),
      vacancies: {
        total: 1500,
        categories: [
          { name: "General", count: 600 },
          { name: "OBC", count: 400 },
          { name: "SC", count: 250 },
          { name: "ST", count: 150 },
          { name: "EWS", count: 100 },
        ],
      },
    }
  }


  let detail: any;
  if (isYojana && yojanaDetail) {
    detail = {
      ...yojanaDetail,
      title: yojanaDetail.title,
      shortTitle: yojanaDetail.title,
      type: "Sarkari Yojana",
      date: yojanaDetail.date,
      description: yojanaDetail.yojanaDescription || '',
      applicationStartDate: yojanaDetail.startDate || '',
      applicationEndDate: yojanaDetail.lastDate || '',
      officialWebsite: yojanaDetail.officialWebsiteUrl || '',
      applyLink: yojanaDetail.applyOnlineUrl || '',
      downloadLink: yojanaDetail.yojanaNotificationUrl || '',
      importantDates: [
        yojanaDetail.startDate ? { event: "Start Date", date: yojanaDetail.startDate } : null,
        yojanaDetail.lastDate ? { event: "Last Date", date: yojanaDetail.lastDate } : null,
      ].filter(Boolean),
      vacancies: {
        total: yojanaDetail.totalVacancies || '',
        categories: [
          yojanaDetail.vacancyGeneral ? { name: 'General', count: yojanaDetail.vacancyGeneral } : null,
          yojanaDetail.vacancyOBC ? { name: 'OBC', count: yojanaDetail.vacancyOBC } : null,
          yojanaDetail.vacancySC ? { name: 'SC', count: yojanaDetail.vacancySC } : null,
          yojanaDetail.vacancyST ? { name: 'ST', count: yojanaDetail.vacancyST } : null,
          yojanaDetail.vacancyEWS ? { name: 'EWS', count: yojanaDetail.vacancyEWS } : null,
          yojanaDetail.vacancyPwD ? { name: 'PwD', count: yojanaDetail.vacancyPwD } : null,
        ].filter(Boolean),
      },
      benefits: Array.from({length: 10}).map((_, i) => (yojanaDetail as Record<string, string>)[`benefit${i+1}`]).filter(Boolean),
      documents: Array.from({length: 10}).map((_, i) => (yojanaDetail as Record<string, string>)[`document${i+1}`]).filter(Boolean),
      criteria: Array.from({length: 10}).map((_, i) => (yojanaDetail as Record<string, string>)[`criteria${i+1}`]).filter(Boolean),
    };
  } else if (isResult && resultDetail && resultJob) {
    // Type assertion for dynamic property access
    const jobData = resultJob as Record<string, any>;
    
    // Extract posts data from resultJob
    const posts = [];
    for (let i = 1; i <= 10; i++) {
      const postName = jobData[`postName${i}`];
      const postEligibility = jobData[`postEligibility${i}`];
      const postAgeLimit = jobData[`postAgeLimit${i}`];
      
      if (postName || postEligibility || postAgeLimit) {
        posts.push({
          name: postName || `Post ${i}`,
          eligibility: postEligibility || '',
          ageLimit: postAgeLimit || ''
        });
      }
    }

    detail = {
      ...resultJob,
      type: "Result",
      title: resultDetail.title,
      shortTitle: resultDetail.title,
      description: resultDetail.description,
      date: resultDetail.date,
      applyLink: resultJob.applyOnlineUrl || '',
      downloadLink: resultDetail.url || resultJob.jobNotificationUrl || '',
      officialWebsite: resultJob.officialWebsiteUrl || resultJob.howToApplyUrl || '',
      posts: posts.length > 0 ? posts : null,
      eligibility: posts.length > 0 ? posts.map((p, idx) => `Post ${idx + 1}: ${p.name} | Eligibility: ${p.eligibility} | Age: ${p.ageLimit}`) : [],
      importantDates: [
        { event: "Start Date", date: resultJob.startDate || '' },
        { event: "Last Date", date: resultJob.lastDate || '' },
        { event: "Admit Card Date", date: resultJob.admitCardDate || '' },
        { event: "Exam Date", date: resultJob.examDate || '' },
        { event: "Result Date", date: resultJob.resultDate || '' }
      ],
      applicationFee: [
        { category: "General/EWS", fee: resultJob.feeGeneral || '' },
        { category: "OBC", fee: resultJob.feeOBC || '' },
        { category: "SC/ST/PwD", fee: resultJob.feeSCST || '' }
      ],
      vacancies: {
        total: resultJob.totalVacancies || '',
        categories: [
          { name: "General", count: resultJob.vacancyGeneral || '' },
          { name: "EWS", count: resultJob.vacancyEWS || '' },
          { name: "OBC", count: resultJob.vacancyOBC || '' },
          { name: "SC", count: resultJob.vacancySC || '' },
          { name: "ST", count: resultJob.vacancyST || '' },
          { name: "PwD", count: resultJob.vacancyPwD || '' }
        ].filter(cat => cat.count !== '')
      },
      coachings: [
        { name: resultJob.coachingName1, url: resultJob.coachingUrl1 },
        { name: resultJob.coachingName2, url: resultJob.coachingUrl2 },
        { name: resultJob.coachingName3, url: resultJob.coachingUrl3 },
        { name: resultJob.coachingName4, url: resultJob.coachingUrl4 },
        { name: resultJob.coachingName5, url: resultJob.coachingUrl5 },
      ].filter(c => c.name && c.url)
    };
  } else if (isAdmitCard && admitCardDetail && admitCardJob) {
    // Type assertion for dynamic property access
    const jobData = admitCardJob as Record<string, any>;
    
    // Extract posts data from admitCardJob
    const posts = [];
    for (let i = 1; i <= 10; i++) {
      const postName = jobData[`postName${i}`];
      const postEligibility = jobData[`postEligibility${i}`];
      const postAgeLimit = jobData[`postAgeLimit${i}`];
      
      if (postName || postEligibility || postAgeLimit) {
        posts.push({
          name: postName || `Post ${i}`,
          eligibility: postEligibility || '',
          ageLimit: postAgeLimit || ''
        });
      }
    }

    detail = {
      ...admitCardJob,
      type: "Admit Card",
      title: admitCardDetail.title,
      shortTitle: admitCardDetail.title,
      description: admitCardDetail.description,
      date: admitCardDetail.date,
      applyLink: admitCardJob.applyOnlineUrl || '',
      downloadLink: admitCardDetail.url || '',
      officialWebsite: admitCardJob.officialWebsiteUrl || admitCardJob.howToApplyUrl || '',
      posts: posts.length > 0 ? posts : null,
      eligibility: posts.length > 0 ? posts.map((p, idx) => `Post ${idx + 1}: ${p.name} | Eligibility: ${p.eligibility} | Age: ${p.ageLimit}`) : [],
      selectionProcess: [
        admitCardJob.selectionProcess1,
        admitCardJob.selectionProcess2,
        admitCardJob.selectionProcess3,
        admitCardJob.selectionProcess4
      ].filter((step): step is string => Boolean(step)),
      importantDates: [
        { event: "Start Date", date: admitCardJob.startDate || '' },
        { event: "Last Date", date: admitCardJob.lastDate || '' },
        { event: "Admit Card Date", date: admitCardJob.admitCardDate || '' },
        { event: "Exam Date", date: admitCardJob.examDate || '' },
        { event: "Result Date", date: admitCardJob.resultDate || '' }
      ],
      applicationFee: [
        { category: "General/EWS", fee: admitCardJob.feeGeneral || '' },
        { category: "OBC", fee: admitCardJob.feeOBC || '' },
        { category: "SC/ST/PwD", fee: admitCardJob.feeSCST || '' }
      ],
      vacancies: {
        total: admitCardJob.totalVacancies || '',
        categories: [
          { name: "General", count: admitCardJob.vacancyGeneral || '' },
          { name: "EWS", count: admitCardJob.vacancyEWS || '' },
          { name: "OBC", count: admitCardJob.vacancyOBC || '' },
          { name: "SC", count: admitCardJob.vacancySC || '' },
          { name: "ST", count: admitCardJob.vacancyST || '' },
          { name: "PwD", count: admitCardJob.vacancyPwD || '' }
        ].filter(cat => cat.count !== '')
      },
      coachings: [
        { name: admitCardJob.coachingName1, url: admitCardJob.coachingUrl1 },
        { name: admitCardJob.coachingName2, url: admitCardJob.coachingUrl2 },
        { name: admitCardJob.coachingName3, url: admitCardJob.coachingUrl3 },
        { name: admitCardJob.coachingName4, url: admitCardJob.coachingUrl4 },
        { name: admitCardJob.coachingName5, url: admitCardJob.coachingUrl5 },
      ].filter(c => c.name && c.url)
    };
  } else if (isAnswerKey && answerKeyDetail && answerKeyJob) {
    // Type assertion for dynamic property access
    const jobData = answerKeyJob as Record<string, any>;
    
    // Extract posts data from answerKeyJob
    const posts = [];
    for (let i = 1; i <= 10; i++) {
      const postName = jobData[`postName${i}`];
      const postEligibility = jobData[`postEligibility${i}`];
      const postAgeLimit = jobData[`postAgeLimit${i}`];
      
      if (postName || postEligibility || postAgeLimit) {
        posts.push({
          name: postName || `Post ${i}`,
          eligibility: postEligibility || '',
          ageLimit: postAgeLimit || ''
        });
      }
    }

    detail = {
      ...answerKeyJob,
      type: "Answer Key",
      title: answerKeyDetail.title,
      shortTitle: answerKeyDetail.title,
      description: answerKeyDetail.description,
      date: answerKeyDetail.date,
      applyLink: answerKeyJob.applyOnlineUrl || '',
      downloadLink: answerKeyDetail.url || answerKeyJob.jobNotificationUrl || '',
      officialWebsite: answerKeyJob.officialWebsiteUrl || answerKeyJob.howToApplyUrl || '',
      posts: posts.length > 0 ? posts : null,
      eligibility: posts.length > 0 ? posts.map((p, idx) => `Post ${idx + 1}: ${p.name} | Eligibility: ${p.eligibility} | Age: ${p.ageLimit}`) : [],
      selectionProcess: [
        answerKeyJob.selectionProcess1,
        answerKeyJob.selectionProcess2,
        answerKeyJob.selectionProcess3,
        answerKeyJob.selectionProcess4
      ].filter((step): step is string => Boolean(step)),
      importantDates: [
        { event: "Start Date", date: answerKeyJob.startDate || '' },
        { event: "Last Date", date: answerKeyJob.lastDate || '' },
        { event: "Admit Card Date", date: answerKeyJob.admitCardDate || '' },
        { event: "Exam Date", date: answerKeyJob.examDate || '' },
        { event: "Result Date", date: answerKeyJob.resultDate || '' }
      ],
      applicationFee: [
        { category: "General/EWS", fee: answerKeyJob.feeGeneral || '' },
        { category: "OBC", fee: answerKeyJob.feeOBC || '' },
        { category: "SC/ST/PwD", fee: answerKeyJob.feeSCST || '' }
      ],
      vacancies: {
        total: answerKeyJob.totalVacancies || '',
        categories: [
          { name: "General", count: answerKeyJob.vacancyGeneral || '' },
          { name: "EWS", count: answerKeyJob.vacancyEWS || '' },
          { name: "OBC", count: answerKeyJob.vacancyOBC || '' },
          { name: "SC", count: answerKeyJob.vacancySC || '' },
          { name: "ST", count: answerKeyJob.vacancyST || '' },
          { name: "PwD", count: answerKeyJob.vacancyPwD || '' }
        ]
      },
      coachings: [
        { name: answerKeyJob.coachingName1, url: answerKeyJob.coachingUrl1 },
        { name: answerKeyJob.coachingName2, url: answerKeyJob.coachingUrl2 },
        { name: answerKeyJob.coachingName3, url: answerKeyJob.coachingUrl3 },
        { name: answerKeyJob.coachingName4, url: answerKeyJob.coachingUrl4 },
        { name: answerKeyJob.coachingName5, url: answerKeyJob.coachingUrl5 },
      ].filter(c => c.name && c.url),
      eligibilityCriteria: [
        "Age Limit: 21-30 years (Age relaxation as per government norms).",
        "Educational Qualification: Bachelor's degree from a recognized university.",
        "Candidates must be Indian citizens.",
        `Candidates must have to check the official notification.`,
      ],
    };
  } else if (isJob && jobDetail) {
    detail = {
      ...jobDetail,
      title: jobDetail.title,
      shortTitle: jobDetail.title,
      type: "Job Notification",
      date: jobDetail.date,
      applicationStartDate: jobDetail.startDate || '',
      applicationEndDate: jobDetail.lastDate || '',
      examDate: jobDetail.examDate || '',
      resultDate: jobDetail.resultDate || '',
      officialWebsite: jobDetail.officialWebsiteUrl || jobDetail.howToApplyUrl || '',
      applyLink: jobDetail.applyOnlineUrl || '',
      downloadLink: jobDetail.jobNotificationUrl || '',
      description: jobDetail.jobDescription || '',
      // Dynamic eligibility posts extraction
      posts: Array.from({length: 10}).map((_, i) => {
        const idx = i + 1;
        const jd = jobDetail as Record<string, any>;
        return {
          name: jd[`postName${idx}`],
          eligibility: jd[`postEligibility${idx}`],
          ageLimit: jd[`postAgeLimit${idx}`]
        };
      }).filter(p => p.name || p.eligibility || p.ageLimit),
      importantDates: [
        { event: "Start Date", date: jobDetail.startDate || '' },
        { event: "Last Date", date: jobDetail.lastDate || '' },
        { event: "Admit Card Date", date: jobDetail.admitCardDate || '' },
        { event: "Exam Date", date: jobDetail.examDate || '' },
        { event: "Result Date", date: jobDetail.resultDate || '' }
      ],
      applicationFee: [
        { category: "General/EWS", fee: jobDetail.feeGeneral || '' },
        { category: "OBC", fee: jobDetail.feeOBC || '' },
        { category: "SC/ST/PwD", fee: jobDetail.feeSCST || '' }
      ],
      selectionProcess: [
        jobDetail.selectionProcess1,
        jobDetail.selectionProcess2,
        jobDetail.selectionProcess3,
        jobDetail.selectionProcess4
      ].filter((step): step is string => Boolean(step)),
      vacancies: {
        total: jobDetail.totalVacancies || '',
        categories: [
          { name: "General", count: jobDetail.vacancyGeneral || '' },
          { name: "EWS", count: jobDetail.vacancyEWS || '' },
          { name: "OBC", count: jobDetail.vacancyOBC || '' },
          { name: "SC", count: jobDetail.vacancySC || '' },
          { name: "ST", count: jobDetail.vacancyST || '' },
          { name: "PwD", count: jobDetail.vacancyPwD || '' }
        ]
      },
      coachings: [
        { name: jobDetail.coachingName1, url: jobDetail.coachingUrl1 },
        { name: jobDetail.coachingName2, url: jobDetail.coachingUrl2 },
        { name: jobDetail.coachingName3, url: jobDetail.coachingUrl3 },
        { name: jobDetail.coachingName4, url: jobDetail.coachingUrl4 },
        { name: jobDetail.coachingName5, url: jobDetail.coachingUrl5 },
      ].filter(c => c.name && c.url),
    };
  } else if (isScholarship && scholarshipDetail) {
    detail = {
      ...scholarshipDetail,
      title: scholarshipDetail.title,
      shortTitle: scholarshipDetail.title,
      type: "Scholarship Test",
      date: scholarshipDetail.date,
      applicationStartDate: scholarshipDetail.startDate || '',
      applicationEndDate: scholarshipDetail.lastDate || '',
      examDate: scholarshipDetail.examDate || '',
      resultDate: scholarshipDetail.resultDate || '',
      officialWebsite: scholarshipDetail.officialWebsiteUrl?.startsWith('http') ? scholarshipDetail.officialWebsiteUrl : (scholarshipDetail.officialWebsiteUrl ? `https://${scholarshipDetail.officialWebsiteUrl}` : ''),
      applyLink: scholarshipDetail.applyOnlineUrl?.startsWith('http') ? scholarshipDetail.applyOnlineUrl : (scholarshipDetail.applyOnlineUrl ? `https://${scholarshipDetail.applyOnlineUrl}` : ''),
      downloadLink: scholarshipDetail.scholarshipNotificationUrl?.startsWith('http') ? scholarshipDetail.scholarshipNotificationUrl : (scholarshipDetail.scholarshipNotificationUrl ? `https://${scholarshipDetail.scholarshipNotificationUrl}` : ''),
      description: scholarshipDetail.jobDescription || '',
      // Dynamic eligibility posts extraction
      posts: Array.from({length: 10}).map((_, i) => {
        const idx = i + 1;
        const sd = scholarshipDetail as Record<string, any>;
        return {
          name: sd[`postName${idx}`],
          eligibility: sd[`postEligibility${idx}`],
          ageLimit: sd[`postAgeLimit${idx}`]
        };
      }).filter(p => p.name || p.eligibility || p.ageLimit),
      importantDates: [
        { event: "Start Date", date: scholarshipDetail.startDate || '' },
        { event: "Last Date", date: scholarshipDetail.lastDate || '' },
        { event: "Admit Card Date", date: scholarshipDetail.admitCardDate || '' },
        { event: "Exam Date", date: scholarshipDetail.examDate || '' },
        { event: "Result Date", date: scholarshipDetail.resultDate || '' }
      ],
      applicationFee: [
        { category: "General/EWS", fee: scholarshipDetail.feeGeneral || '' },
        { category: "OBC", fee: scholarshipDetail.feeOBC || '' },
        { category: "SC/ST/PwD", fee: scholarshipDetail.feeSCST || '' }
      ],
      selectionProcess: [
        scholarshipDetail.selectionProcess1 || '',
        scholarshipDetail.selectionProcess2 || '',
        scholarshipDetail.selectionProcess3 || '',
        scholarshipDetail.selectionProcess4 || ''
      ].filter((step): step is string => Boolean(step)),
      vacancies: {
        total: scholarshipDetail.totalVacancies || '',
        categories: [
          { name: "General", count: scholarshipDetail.vacancyGeneral || '' },
          { name: "EWS", count: scholarshipDetail.vacancyEWS || '' },
          { name: "OBC", count: scholarshipDetail.vacancyOBC || '' },
          { name: "SC", count: scholarshipDetail.vacancySC || '' },
          { name: "ST", count: scholarshipDetail.vacancyST || '' },
          { name: "PwD", count: scholarshipDetail.vacancyPwD || '' }
        ]
      },
      coachings: [
        { name: scholarshipDetail.coachingName1, url: scholarshipDetail.coachingUrl1 },
        { name: scholarshipDetail.coachingName2, url: scholarshipDetail.coachingUrl2 },
        { name: scholarshipDetail.coachingName3, url: scholarshipDetail.coachingUrl3 },
        { name: scholarshipDetail.coachingName4, url: scholarshipDetail.coachingUrl4 },
        { name: scholarshipDetail.coachingName5, url: scholarshipDetail.coachingUrl5 },
      ].filter(c => c.name && c.url),
    };
  } else {
    detail = await getDetailData(id);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-teal-700 text-white py-2 sm:py-3 px-3 sm:px-4 text-center">
        <div className="container mx-auto">
          <Link href="/" className="inline-block">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">SARKARI RESULTS</h1>
            <p className="text-xs sm:text-sm mt-1">Latest Government Jobs, Results, Admit Cards, Answer Keys</p>
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b py-2 px-3 sm:px-4 overflow-x-auto whitespace-nowrap">
        <div className="container mx-auto">
          <div className="flex items-center text-xs sm:text-sm">
            <Link href="/" className="text-blue-600 hover:underline flex items-center flex-shrink-0">
              <ArrowLeft className="h-3 w-3 mr-1" /> Home
            </Link>
            <span className="mx-2">/</span>
            <Link 
              href={
                detail.type === "Job Notification" ? "/jobs" :
                detail.type === "Admit Card" ? "/admit-cards" :
                detail.type === "Result" ? "/results" :
                detail.type === "Answer Key" ? "/answer-keys" :
                detail.type === "Sarkari Yojana" ? "/sarkari-yojana" :
                detail.type === "Internship" ? "/internship" :
                detail.type === "Scholarship Test" ? "/scholarship-test" :
                `/${detail.type.toLowerCase().replace(/\s+/g, "-")}s`
              } 
              className="text-blue-600 hover:underline flex-shrink-0"
            >
              {detail.type === "Job Notification" ? "Latest Jobs" : detail.type + "s"}
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium flex-shrink-0">{detail.shortTitle}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="bg-white border rounded-sm p-3 sm:p-4 mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl font-bold mb-2 text-teal-700">{detail.title}</h1>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>Posted: {detail.date}</span>
            </div>

            {/* Quick Links Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-2 sm:p-3 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold mb-2 text-blue-700">Quick Links</h2>
              <div className="grid grid-cols-1 gap-2">
                {/* Internship: Only Apply Online & Official Website */}
                {detail.type === 'Internship' ? (
                  <>
                    <Link
                      href={detail.applyLink || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline text-sm"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Apply Online
                    </Link>
                    <Link
                      href={detail.officialWebsite || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline text-sm"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Official Website
                    </Link>
                    <Link href="#important-dates" className="flex items-center text-blue-600 hover:underline text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Important Dates
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={detail.applyLink || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline text-sm"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Apply Online
                    </Link>
                    {/* Download button removed for Internship */}
                    {detail.type !== 'Internship' && (
                      <Link
                        href={detail.downloadLink || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline text-sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Download {detail.type}
                      </Link>
                    )}
                    <Link
                      href={detail.officialWebsite || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline text-sm"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Official Website
                    </Link>
                    <Link href="#important-dates" className="flex items-center text-blue-600 hover:underline text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Important Dates
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Sarkari Yojana: Benefits, Documents, Eligibility, Dates, Vacancy, How to Apply, Links (custom order) */}
            {detail.type === 'Sarkari Yojana' ? (
              <>
                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">Description</h2>
                  <p className="text-sm">{detail.description}</p>
                </div>

                {/* Benefits */}
                {detail.benefits && detail.benefits.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Benefits</h2>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {detail.benefits.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Required Documents */}
                {detail.documents && detail.documents.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Required Documents</h2>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {detail.documents.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Eligibility Criteria */}
                {detail.criteria && detail.criteria.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Eligibility Criteria</h2>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {detail.criteria.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Important Dates */}
                <div className="mb-4 sm:mb-6" id="important-dates">
                  <h2 className="text-base sm:text-lg font-bold mb-2 text-teal-700">Important Dates</h2>
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Event</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Dates</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(detail.importantDates || []).map((item: any, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border border-gray-300 px-4 py-2">{item.event}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Vacancies */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">Vacancy Details</h2>
                  <p className="text-sm mb-2">
                    Total Vacancies: <strong>{detail.vacancies?.total || ''}</strong>
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Vacancies</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detail.vacancies?.categories || []).map((item: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* How to Apply */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">How to Apply</h2>
                  <ol className="list-decimal pl-5 text-sm space-y-1">
                    <li>
                      Visit the official website:{' '}
                      <a
                        href={detail.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {detail.officialWebsite}
                      </a>
                    </li>
                    <li>Click on the "Sarkari Yojana" section.</li>
                    <li>Register yourself if you are a new user.</li>
                    <li>Fill in all the required details in the application form.</li>
                    <li>Upload scanned documents as per the specifications.</li>
                    <li>Pay the application fee as applicable.</li>
                    <li>Submit the application and take a printout for future reference.</li>
                  </ol>
                </div>
                {/* Important Links */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">Important Links</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Links</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2">Apply Online</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <a
                              href={detail.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Click Here
                            </a>
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">Download Notification</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <a
                              href={detail.downloadLink || ''}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Click Here
                            </a>
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2">Official Website</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <a
                              href={detail.officialWebsite || ''}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Click Here
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Disclaimer (Sarkari Yojana only, always last) */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-2 sm:p-3 text-xs text-gray-700">
                  <p>
                    <strong>Disclaimer:</strong> The information provided here is based on the official notification.
                    Candidates are advised to visit the official website for the most accurate and up-to-date information.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">Description</h2>
                  <p className="text-sm">{detail.description}</p>
                </div>

                {/* Important Dates */}
                <div className="mb-4 sm:mb-6" id="important-dates">
                  <h2 className="text-base sm:text-lg font-bold mb-2 text-teal-700">Important Dates</h2>
                  <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Event</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Dates</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(detail.importantDates || []).map((item: any, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border border-gray-300 px-4 py-2">{item.event}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Application Fee (not for Internship and not for Sarkari Yojana) */}
                {detail.type !== 'Internship' && detail.type !== 'Sarkari Yojana' && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Application Fee</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Fee</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(detail.applicationFee || []).map((item: any, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.fee}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Vacancies */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">Vacancy Details</h2>
                  <p className="text-sm mb-2">
                    Total Vacancies: <strong>{detail.vacancies?.total || ''}</strong>
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Vacancies</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detail.vacancies?.categories || []).map((item: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Eligibility */}
                {Array.isArray(detail.posts) && detail.posts.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-bold mb-2 text-teal-700">Eligibility Criteria</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {detail.posts.map((post: any, idx: number) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded shadow-sm bg-gray-50 p-3 flex flex-col"
                        >
                          <div className="font-semibold text-teal-700 mb-1 text-sm sm:text-base">
                            {post.name || `Post ${idx + 1}`}
                          </div>
                          <div className="mb-1 text-xs sm:text-sm">
                            {renderEligibility(post.eligibility)}
                          </div>
                          <div className="text-xs sm:text-sm">
                            <span className="font-medium">Age Limit:</span>{' '}
                            {post.ageLimit || <span className="text-gray-400">N/A</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stipend Details (for Internships only) */}
                {detail.type === 'Internship' && detail.stipendDetails && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-3 text-teal-700">Stipend Details</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.stipendDetails.map((item: any, index: number) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <td className="border border-gray-300 px-4 py-2">{item.amount}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Eligibility Criteria (Sarkari Yojana only) */}
                {detail.type === 'Sarkari Yojana' && detail.criteria && detail.criteria.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Eligibility Criteria</h2>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {detail.criteria.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Benefits (Sarkari Yojana only) */}
                {detail.type === 'Sarkari Yojana' && detail.benefits && detail.benefits.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Benefits</h2>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {detail.benefits.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Required Documents (Sarkari Yojana only) */}
                {detail.type === 'Sarkari Yojana' && detail.documents && detail.documents.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Required Documents</h2>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {detail.documents.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Selection Process (not for Sarkari Yojana) */}
                {detail.type !== 'Sarkari Yojana' && detail.selectionProcess && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Selection Process</h2>
                    <ol className="list-decimal pl-6 text-sm space-y-2">
                      {detail.selectionProcess.map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* How to Apply */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">How to Apply</h2>
                  <ol className="list-decimal pl-5 text-sm space-y-1">
                    <li>
                      Visit the official website:{" "}
                      <a
                        href={detail.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {detail.officialWebsite}
                      </a>
                    </li>
                    <li>Click on the "{detail.type === 'Internship' ? 'Internship' : (detail.type === 'Scholarship Test' ? 'Scholarship' : 'Job Notification')}" section.</li>
                    <li>Register yourself if you are a new user.</li>
                    <li>Fill in all the required details in the application form.</li>
                    <li>Upload scanned documents as per the specifications.</li>
                    <li>Pay the application fee as applicable.</li>
                    <li>Submit the application and take a printout for future reference.</li>
                  </ol>
                </div>

                {/* Important Links */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2 text-teal-700">Important Links</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Links</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2">Apply Online</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <a
                              href={detail.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Click Here
                            </a>
                          </td>
                        </tr>
                        {/* Download row removed for Internship */}
                        {detail.type !== 'Internship' && (
                          <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Download {detail.type}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <a
                                href={detail.downloadLink || ''}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Click Here
                              </a>
                            </td>
                          </tr>
                        )}
                        <tr className="bg-white">
                          <td className="border border-gray-300 px-4 py-2">Official Website</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <a
                              href={detail.officialWebsite || ''}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Click Here
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                
                {/* Top Coaching Institutes (not for Sarkari Yojana) */}
                {detail.type !== 'Sarkari Yojana' && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold mb-2 text-teal-700">Top Coaching Institutes</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Institute Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Website</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            // Find matching coaching data
                            const matchingKey = Object.keys(coachingData).find(key => 
                              key.toLowerCase().includes(detail.shortTitle.toLowerCase()) ||
                              detail.shortTitle.toLowerCase().includes(key.split(" ")[0].toLowerCase())
                            );
                            
                            if (matchingKey && (coachingData as CoachingData)[matchingKey]) {
                              return (coachingData as CoachingData)[matchingKey].map((institute, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="border border-gray-300 px-4 py-2">{institute.name}</td>
                                  <td className="border border-gray-300 px-4 py-2">
                                    <a
                                      href={institute.url || ''}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center"
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" /> Visit Website
                                    </a>
                                  </td>
                                </tr>
                              ));
                            } else {
                              return (
                                <tr>
                                  <td colSpan={2} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                                    No coaching institutes found for this exam.
                                  </td>
                                </tr>
                              );
                            }
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-2 sm:p-3 text-xs text-gray-700">
                  <p>
                    <strong>Disclaimer:</strong> The information provided here is based on the official notification.
                    Candidates are advised to visit the official website for the most accurate and up-to-date information.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      
    </div>
  )
}
