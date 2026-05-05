export function splitFileName(filePath: string) {
  const matches = filePath.match(/\/([^/]+)$/);
  const fileName = matches ? matches[1] : "";

  const cleanedFileName = fileName.replace(/[-_]/g, "").replace(/\.pdf$/, "");

  const match = cleanedFileName.match(/^(MAR\d+)(.*)$/);
  if (match) {
    return match[1];
  }
}

export function getNameMar(filePath: string) {
  const matches = filePath.match(/\/([^/]+)$/);
  const fileName = matches ? matches[1] : "";

  const cleanedFileName = fileName.replace(/[-_]/g, "").replace(/\.pdf$/, "");

  const match = cleanedFileName.match(/^(MAR\d+)(.*)$/);
  if (match) {
    return match[2];
  }
}

export function formatFileName(name: string) {
  const lastDotIndex = name.lastIndexOf(".");

  if (lastDotIndex > 0) {
    return name.substring(0, lastDotIndex);
  }

  return name;
}
