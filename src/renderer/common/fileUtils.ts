export function openFileSelector(
  changeInput: (fileInput: HTMLInputElement) => void,
  onSelect: (file: File) => void
) {
  // create the file input dynamically
  const fileInput = document.createElement('input');
  changeInput?.(fileInput);

  // register the change event to capture the selected files
  fileInput.addEventListener('change', function () {
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

export function openHextFileSelector(onSelect: (file: File) => void) {
  return openFileSelector((fileInput: HTMLInputElement) => {
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', '.zip, .hext');
    fileInput.setAttribute('multiple', 'false'); // accept only one file
  }, onSelect);
}
