import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

class HrFlowService {
  buildHeaders(apiSecret, apiUser) {
    return {
      'X-API-KEY': apiSecret,
      'X-USER-EMAIL': apiUser,
      'Content-Type': 'application/json'
    };
  }

  async parseJob(text, apiSecret, apiUser) {
    const url = 'https://api.hrflow.ai/v1/text/parsing';
    const headers = this.buildHeaders(apiSecret, apiUser);
    const response = await axios.post(url, {
      texts: [text],
      parsing_model: 'atlas',
      output_object: 'job'
    }, { headers });

    const job = response.data.data[0].job;
    delete job.key;
    delete job.board;
    delete job.board_key;
    job.sections = [{
      name: 'Job Description',
      title: 'Job Description',
      description: text,
    }];
    return job;
  }

  async enrichLocation(job, apiSecret, apiUser) {
    const locationText = job?.location?.text;
    if (!locationText) return job;

    const url = 'https://api.hrflow.ai/v1/text/geocoding';
    const headers = this.buildHeaders(apiSecret, apiUser);
    const response = await axios.post(url, {
      texts: [locationText]
    }, { headers });

    job.location = response.data.data[0];
    return job;
  }

  async storeJob(job, boardKey, apiSecret, apiUser) {
    const url = 'https://api.hrflow.ai/v1/job/indexing';
    const headers = this.buildHeaders(apiSecret, apiUser);
    const response = await axios.post(url, {
      job,
      board_key: boardKey
    }, { headers });

    return { jobKey: response.data.data.key, jobJson: response.data.data };
  }

  async putJob(job, boardKey, apiSecret, apiUser) {
    const url = 'https://api.hrflow.ai/v1/job/indexing';
    const headers = this.buildHeaders(apiSecret, apiUser);
    const response = await axios.put(url, {
      job,
      board_key: boardKey,
    }, { headers });

    return response.data.data;
  }

  async getJobInfoFromAsking(apiSecret, apiUser, boardKey, jobKey, job, locationDistanceRadius = 30) {
    const url = 'https://api.hrflow.ai/v1/job/asking';
    const headers = this.buildHeaders(apiSecret, apiUser);
    const questions = [
      "What is the job title?",
      `Is there a date from which profiles are desired in the job description section? If yes, respond only with an integer representing the number of months. If no, respond with 0.`,
      `Is there a radius from which profiles are desired in the job description section? If yes, respond only with an integer representing the radius in kilometers. If no, respond with 0.`,
      "What is the minimum seniority required for this job?",
      "If there is a seniority for the job, respond only with an integer representing the number of years else 0.",
    ];

    const params = {
      board_key: boardKey,
      key: jobKey,
    };

    questions.forEach((q, i) => {
      params[`questions[${i}]`] = q;
    });

    const response = await axios.get(url, { headers, params });
    const data = response.data.data;
    const dateRangeMonths = parseInt(data[1] || '0', 10);
    const now = new Date();

    let created_at_min = null;
    if (dateRangeMonths > 0) {
      const date_range_days = dateRangeMonths * 30;
      const minDate = new Date(now.getTime() - (date_range_days * 24 * 60 * 60 * 1000));
      created_at_min = minDate.toISOString();
    }

    const created_at_max = now.toISOString();

    return {
      job_title: data[0],
      filters: {
        location: job.location?.lat && job.location?.lng ? { lat: job.location.lat, lng: job.location.lng } : null,
        radius: parseInt(data[2]) || locationDistanceRadius,
        seniority: parseInt(data[4]) || 0,
        created_at_min,
        created_at_max
      }
    };
  }

  async fetchScoredProfiles(apiSecret, apiUser, sourceKeys, boardKey, jobKey, algorithmKey, filters, numberOfProfilesToScore = 10) {
    const url = 'https://api.hrflow.ai/v1/profiles/scoring';
    const headers = this.buildHeaders(apiSecret, apiUser);
    const params = {
      source_keys: JSON.stringify(sourceKeys),
      board_key: boardKey,
      job_key: jobKey,
      algorithm_key: algorithmKey,
      use_algorithm: 1,
      limit: numberOfProfilesToScore,
      page: 1,
      sort_by: 'scoring',
      order_by: 'desc',
      created_at_min: filters.created_at_min,
      created_at_max: filters.created_at_max,
      experiences_duration_min: filters.seniority
    };

    if (filters.location) {
      params.location_distance = filters.radius;
      params.location_geopoint = filters.location;
    }

    const response = await axios.get(url, { headers, params });
    const { profiles } = response.data.data;
    return profiles;
  }

  async gradeProfilesBatch(profiles, jobKey, boardKey, apiKey, userEmail, algorithmKey = 'grader-hrflow-profiles-titan', numberOfProfilesToGrade = 3) {
    const headers = this.buildHeaders(apiKey, userEmail);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('algorithm_key', algorithmKey);
      queryParams.append('job_key', jobKey);
      queryParams.append('board_key', boardKey);

      const top = profiles.slice(0, numberOfProfilesToGrade);

      top.forEach((profile, index) => {
        queryParams.append(`profile_ids[${index}][source_key]`, profile.source_key);
        queryParams.append(`profile_ids[${index}][profile_key]`, profile.key);
      });

      const url = `https://api.hrflow.ai/v1/profile/grading?${queryParams}`;
      const response = await axios.get(url, { headers });

      const gradedProfiles = top.map((profile, index) => ({
        ...profile,
        score: response.data.data.scores[index][1]
      }));

      return gradedProfiles;
    } catch (error) {
      console.error('Error grading profiles batch:', error);
      return [];
    }
  }

  async tagText(labels, context, texts, algorithmKey, apiKey, apiUser, outputLanguage = 'en') {
    const headers = this.buildHeaders(apiKey, apiUser);
    const url = 'https://api.hrflow.ai/v1/text/tagging';
    const payload = {
      texts: texts,
      algorithm_key: algorithmKey,
      dynamic_context: outputLanguage === 'fr' ? context.fr : context.en,
      labels: labels.map((l) => {
        if (outputLanguage === 'fr') {
          return l.label_fr;
        }
        return l.label;
      }),
      top_n: 1,
      output_lang: outputLanguage
    };

    try {
      const response = await axios.post(url, payload, { headers });
      if (!response.data.data[0].tags[0]) {
        return { label: outputLanguage === 'fr' ? 'Autre' : 'Other', value: labels.length - 1 };
      } else {
        return { label: response.data.data[0].tags[0], value: response.data.data[0].ids[0] };
      }
    } catch (e) {
      console.log('error tagging api', e);
      return null;
    }
  }

  async summaryProfile(profileKey, sourceKey, apiKey, apiUser, outputLanguage = 'en') {
    const headers = this.buildHeaders(apiKey, apiUser);

    try {
      const summaryLang = outputLanguage === 'en' ? 'french' : 'french';
      const questions = [`Write a 20 words summary in ${summaryLang} about this profile`];
      const url = `https://api.hrflow.ai/v1/profile/asking?key=${profileKey}&source_key=${sourceKey}&questions=${encodeURIComponent(JSON.stringify(questions))}`;

      const response = await axios.get(url, { headers });
      return response.data.data[0];
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Summary request was aborted');
        return null;
      }
      console.error('Error summarizing profile:', error);
      return null;
    }
  }

  async explainProfile(profileKey, sourceKey, boardKey, jobKey, apiKey, apiUser, outputLanguage = 'en', score) {
    const headers = this.buildHeaders(apiKey, apiUser);

    try {
      const upskillingQuery = {
        source_key: sourceKey,
        profile_key: profileKey,
        board_key: boardKey,
        job_key: jobKey,
        output_lang: outputLanguage,
        score: score
      };

      const url = `https://api.hrflow.ai/v1/profile/upskilling`;
      const queryString = Object.entries(upskillingQuery)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      const response = await axios.get(`${url}?${queryString}`, { headers });
      return response.data.data;
    } catch (error) {
      console.error('Error explaining profile:', error);
      return { strengths: [], weaknesses: [] };
    }
  }

  async extractTextFromResume(filePath, apiSecret, apiUser) {
    const url = 'https://api.hrflow.ai/v1/text/ocr';
    const headers = {
      'X-API-KEY': apiSecret,
      'X-USER-EMAIL': apiUser
    };

    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await axios.post(url, formData, {
        headers: {
          ...headers,
          ...formData.getHeaders()
        }
      });

      return response.data.data?.text || '';
    } catch (error) {
      console.error('Error extracting text from resume:', error);
      throw error;
    }
  }
}

export default new HrFlowService();

