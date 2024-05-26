export function openFileSelectorInt(
  changeInput: (fileInput: HTMLInputElement) => void,
  onSelect: (file: File) => void
) {
  // create the file input dynamically
  const fileInput = document.createElement('input');
  changeInput?.(fileInput);

  // register the change event to capture the selected files
  fileInput.addEventListener('change', () => {
    const { files } = fileInput;
    // perform the operation you want on the selected files
    // e.g., print the name of the first selected file
    if (files && files.length > 0) {
      onSelect(files[0]);
    }
  });

  // programmatically trigger the click event
  fileInput.click();
}

export function openFileSelector(
  onSelect: (file: File) => void,
  acceptFileTypes: string,
  multiple = false
) {
  return openFileSelectorInt((fileInput: HTMLInputElement) => {
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', acceptFileTypes);
    fileInput.setAttribute('multiple', multiple ? 'true' : 'false'); // accept only one file
  }, onSelect);
}

export function openImageFileSelector(
  onSelect: (file: File) => void,
  multiple = false
) {
  return openFileSelector(onSelect, 'image/*', multiple);
}

export function openHextFileSelector(onSelect: (file: File) => void) {
  return openFileSelector(onSelect, '.zip, .hext', false);
}

export function prettifyFileSize(size: number): string {
  if (size < 1024) {
    return `${size} Bytes`;
  }
  if (size < 1048576) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  if (size < 1073741824) {
    return `${(size / 1048576).toFixed(2)} MB`;
  }
  return `${(size / 1073741824).toFixed(2)} GB`;
}
