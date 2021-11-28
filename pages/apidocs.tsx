import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
  return <SwaggerUI url="https://orange-alliance.github.io/TOA-Docs/openapi.yml" />;
};

export default ApiDocs;
