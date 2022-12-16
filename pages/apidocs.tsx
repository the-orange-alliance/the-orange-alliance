import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import SEO from '../components/seo';

const ApiDocs = () => {
  return (
    <>
      <SEO title="API Docs" description="API Documentation for the TOA REST API." url="/apidocs" />
      <SwaggerUI url="https://orange-alliance.github.io/TOA-Docs/openapi.yml" />
    </>
  );
};

export default ApiDocs;
