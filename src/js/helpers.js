import { TIMEOUT_SEC } from './config.js';
const timout = s => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took long time! Timout after ${s} second`));
    }, 1000 * s);
  });
};
/**
 * Fetches with a timeout guard so a hung request rejects instead of
 * leaving the UI in a loading state. When uploadData is provided the
 * request becomes a POST with a JSON body.
 * @param {string} url
 * @param {Object} [uploadData] - Payload to POST; omit to GET.
 * @returns {Promise<Object>} Parsed JSON response.
 */
export const AJAX = async (url, uploadData) => {
  const fetchPro = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);
  const res = await Promise.race([fetchPro, timout(TIMEOUT_SEC)]);
  const data = await res.json();
  const message = `${data.message} (${res.status})`;
  if (!res.ok || data.results === 0) throw new Error(message);
  return data;
};
