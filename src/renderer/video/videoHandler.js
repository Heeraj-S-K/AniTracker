const VALID_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.wmv', '.flv', '.kmp'];

export function isValidVideoFile(filePath) {
  if (!filePath) return false;
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  return VALID_EXTENSIONS.includes(ext);
}

export function toFileUrl(filePath) {
  if (!filePath) return '';
  // Use custom secure protocol
  const normalized = filePath.replace(/\\/g, '/');
  return `video://${normalized}`;
}

export async function selectVideoFile() {
  if (!window.electronAPI) {
    console.warn('electronAPI not available — running outside Electron');
    return null;
  }
  const filePath = await window.electronAPI.openFile();
  if (!filePath) return null;
  if (!isValidVideoFile(filePath)) {
    throw new Error(`Unsupported video format. Accepted: ${VALID_EXTENSIONS.join(', ')}`);
  }
  return filePath;
}

export async function selectVideoFolder() {
   if (!window.electronAPI) return [];
   const files = await window.electronAPI.openDirectory();
   return files || [];
}

export async function checkFileExists(filePath) {
  if (!window.electronAPI) return false;
  return window.electronAPI.fileExists(filePath);
}
