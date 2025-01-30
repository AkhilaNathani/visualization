const xlsx = require('xlsx');
const axios = require('axios');
const cheerio = require('cheerio');
const filePath = 'courses.xlsx';
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);
async function scrapeCourseDetails(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const courseTitle = $('h1#course_preview_title').text().trim();
    const courseCredits = $('strong:contains("Description:")').parent().text().trim();
    return { courseTitle, courseCredits };
  } catch (error) {
    console.error(`Error fetching data for URL: ${url}`, error.message);
    return { courseTitle: null, courseCredits: null };
  }
}
async function processCourses() {
  const subjects = [
    'CS 2010 - Programming Fundamentals', 'CS 2900 - Career Preparation in Computing Fields', 
    'MATH 1280 - Precalculus Mathematics', 'CS 2020 - Intermediate Programming', 
    'CS 2190 - Computer Organization', 'MATH 2220 - Discrete Mathematics', 
    'CS 3350 - Data Structures', 'CS 3080 - Operating Systems', 
    'CS 3210 - Introduction to Software Security', 'CS 4620 - Database Management Systems', 
    'CS 3000 - Professional and Societal Issues in Computing', 
    'CS 4390 - Network Architecture and Applications', 
    'CS 3900 - Internship in Computer Science', 
    'MATH 2470 - Fundamentals of Statistics'
  ];
  const results = [];
  for (const subject of subjects) {
    const record = data.find(row => row.Subject === subject);
    if (record && record.Link) {
      console.log(`Fetching data for: ${subject}`);
      const details = await scrapeCourseDetails(record.Link);
      results.push({ subject, link: record.Link, ...details });
    } else {
      results.push({ subject, link: null, courseTitle: null, courseCredits: null });
    }
  }
  const newSheet = xlsx.utils.json_to_sheet(results);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Course Details');
  xlsx.writeFile(newWorkbook, 'course_details.xlsx');
  console.log('Scraping complete. Results saved to course_details.xlsx');
}
processCourses();
