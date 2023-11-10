/* Fix markdown line endings  https://stackoverflow.com/questions/63989230/why-is-react-markdown-outputting-code-blocks-instead-of-htm */
export const stripIndent = (str?: string) => {
  if (!str) return str;
  try {
    return str
      .split('\n')
      .map((l: string) => l.trim())
      .join('\n');
  } catch {
    return str;
  }
};
