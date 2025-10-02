export default function generateUsername(fullName) {
  // make lowercase and strip non-alphanumeric chars
  let base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")    // remove symbols
    .replace(/\s+/g, "");         // remove spaces

  // fallback if name is too short
  if (!base) base = "user";

  // add random 4-digit number for uniqueness
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  return `${base}${randomNum}`;
}
