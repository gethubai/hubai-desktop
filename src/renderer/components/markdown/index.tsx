/* eslint-disable react/no-unstable-nested-components */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

export default function Markdown(props: any) {
  return (
    <ReactMarkdown
      {...props}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter {...props} language={match[1]} PreTag="div">
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
        img({ className }) {
          return (
            <img
              {...props}
              alt=""
              className={className}
              style={{ maxWidth: '100%' }}
            />
          );
        },
        a({ href, className, children }) {
          return (
            <a
              {...props}
              className={className}
              role="button"
              tabIndex={0}
              onClick={() => window.open(href, '_blank')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  window.open(href, '_blank');
                }
              }}
            >
              {children}
            </a>
          );
        },
      }}
    />
  );
}
