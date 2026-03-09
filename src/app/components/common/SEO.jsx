import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonical,
  ogImage = "https://chesspuzzledirectory.com/media/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image"
}) => {
  const siteTitle = "Chess Puzzle Directory";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  
  // Default keywords if none provided, targeting the user's list
  const defaultKeywords = "chess puzzles, daily chess puzzles, chess tactics, solve chess puzzles, chess puzzle of the day, hard chess puzzles, easy chess puzzles, chess puzzles for beginners";
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={canonical || window.location.href} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical || window.location.href} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
