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
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
        img({ node, className, children, ...props }) {
          return (
            <img
              {...props}
              className={className}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          );
        },
        a({ node, href, className, children, ...props }) {
          return (
            <a
              {...props}
              className={className}
              onClick={() => window.open(href, '_blank')}
            >
              {children}
            </a>
          );
        },
      }}
    />
  );
}
