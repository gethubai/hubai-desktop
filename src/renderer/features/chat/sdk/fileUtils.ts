/* eslint-disable @typescript-eslint/ban-ts-comment */
export function isBlobWebAPI(uri: unknown): uri is Blob {
  return (
    typeof window !== 'undefined' && 'Blob' in window && uri instanceof Blob
  );
}

export function isFileWebAPI(uri: unknown): uri is File {
  return (
    typeof window !== 'undefined' && 'File' in window && uri instanceof File
  );
}

export function isBuffer(obj: unknown): obj is Buffer {
  return (
    obj != null &&
    (obj as Buffer).constructor != null &&
    // @ts-expect-error
    typeof obj.constructor.isBuffer === 'function' &&
    // @ts-expect-error
    obj.constructor.isBuffer(obj)
  );
}
