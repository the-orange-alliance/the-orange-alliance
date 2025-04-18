import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import SEO from '@/components/seo';
import { useTheme } from '@mui/material';

const ApiDocs = () => {
  const theme = useTheme();

  return (
    <>
      <SEO title="API Docs" description="API Documentation for the TOA REST API." url="/apidocs" />
      <div className={`swagger-${theme.palette.mode}`}>
        <SwaggerUI url="https://the-orange-alliance.github.io/TOA-Docs/openapi.yml" />
      </div>
      <style jsx global>{`
        .swagger-dark .swagger-ui {
          filter: invert(88%) hue-rotate(180deg);
        }
        .swagger-dark .swagger-ui .microlight {
          filter: invert(100%) hue-rotate(180deg);
        }
      `}</style>
    </>
  );
};

export default ApiDocs;
