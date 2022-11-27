import Head from 'next/head';

const defaultDescription =
  'The Orange Alliance is best way to scout, watch, and relive FIRST Tech Challenge. We empower and support the next generation of innovators and leaders.';

interface Props {
  title?: string;
  isFullTitle?: boolean;
  description?: string;
  url?: string;
  ogImage?: string;
}

const SEO: React.FC<Props> = ({ title, isFullTitle = false, description, url, ogImage }) => {
  return (
    <Head>
      <title>
        {title && !isFullTitle ? title + ' | The Orange Alliance' : title || 'The Orange Alliance'}
      </title>
      <meta
        property="og:title"
        content={
          title && !isFullTitle ? title + ' | The Orange Alliance' : title || 'The Orange Alliance'
        }
      />
      <meta property="og:description" content={description || defaultDescription} />
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:site_name" content="The Orange Alliance" />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={`https://theorangealliance.org${ogImage || '/assets/opengraph.png'}`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="shortcut icon" href="/assets/logo.png" />
      <meta
        name="keywords"
        content="FIRST, FIRST Tech Challenge, FTC, STEM, robotics, scores, results, team, match, video, watch"
      />
      {url !== undefined && (
        <>
          <meta property="og:url" content={`https://theorangealliance.org${url}`} />
          <link rel="canonical" href={`https://theorangealliance.org${url}`} />
        </>
      )}
    </Head>
  );
};

export default SEO;
