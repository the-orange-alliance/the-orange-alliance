import { GetServerSideProps } from 'next';

const NoTabRoute = () => {
  return <></>;
};

export default NoTabRoute;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    redirect: {
      destination: req.url + '/rankings',
      permanent: false
    }
  };
};
