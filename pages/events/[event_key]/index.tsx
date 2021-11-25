import { GetServerSideProps, GetServerSidePropsContext } from 'next';

const NoTabRoute = () => {
  return <></>;
};

export default NoTabRoute;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    redirect: {
      destination: context.resolvedUrl + '/rankings',
      permanent: false
    }
  };
};
