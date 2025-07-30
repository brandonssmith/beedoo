import React from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content, className = "" }) => {
  // Simple function to convert plain text with basic formatting to HTML
  const formatContent = (text: string): string => {
    if (!text) return '';
    
    // Convert basic markdown-style formatting
    let formatted = text
      // Bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Underline: ~text~
      .replace(/~(.*?)~/g, '<u>$1</u>')
      // Headers: # Header, ## Subheader, ### Subsubheader
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-extrabold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
      // Alignment markers
      .replace(/ \[CENTER\] /g, '<div class="text-center">')
      .replace(/ \[RIGHT\] /g, '<div class="text-right">')
      // Markdown-style links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>')
      // URLs: convert to clickable links (fallback for plain URLs)
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>')
      // www. URLs: convert to clickable links (prepend https://)
      .replace(/(www\.[^\s]+\.[^\s]+)/g, '<a href="https://$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br>');

    // Handle alignment divs properly
    formatted = formatted
      .replace(/<div class="text-center">(.*?)<br>/g, '<div class="text-center">$1</div>')
      .replace(/<div class="text-right">(.*?)<br>/g, '<div class="text-right">$1</div>');

    return formatted;
  };

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
    />
  );
};

export default RichTextDisplay; 