
declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const atomDark: any;
}

declare module 'react-syntax-highlighter' {
  export const Prism: any;
}

declare module 'react-syntax-highlighter/dist/esm/default-highlight' {
  const SyntaxHighlighter: React.ComponentType<{
    language?: string;
    style?: any;
    children?: React.ReactNode;
    customStyle?: React.CSSProperties;
    className?: string;
    wrapLines?: boolean;
    showLineNumbers?: boolean;
    lineProps?: ((lineNumber: number) => React.HTMLAttributes<HTMLElement>) | React.HTMLAttributes<HTMLElement>;
    [key: string]: any;
  }>;
  export default SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs' {
  export const tomorrow: any;
}
