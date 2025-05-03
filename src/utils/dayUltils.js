export function convertISOToDate(isoString) {
  const date = new Date(isoString);

  // Lấy ngày, tháng, năm
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  // Lấy giờ, phút, giây
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");

  // Trả về định dạng dd/mm/yyyy hh:mm:ss
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `;
}

// Sử dụng hàm
const isoString = "2024-12-22T14:30:00.000Z";

export function getUniqueLines(inputStr) {
  const lines = inputStr.split("\n").filter((line) => line.trim() !== "");
  const unique = Array.from(new Set(lines));
  return unique.join("\n");
}
