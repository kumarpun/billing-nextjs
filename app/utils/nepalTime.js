// utils/nepalTime.js
export function toNepalTime(dateInput) {
    const date = new Date(dateInput);
  
    // Nepal Time offset: UTC+5:45
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const nepalOffset = 5 * 60 + 45; // minutes
    return new Date(utc + nepalOffset * 60 * 1000);
  }
  
  // Format as "YYYY-MM-DD HH:mm" if needed
  export function formatNepalTime(dateInput) {
    const date = toNepalTime(dateInput);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }
  