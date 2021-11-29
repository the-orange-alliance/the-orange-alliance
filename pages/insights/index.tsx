import { GetServerSideProps, GetServerSidePropsContext } from 'next';

const NoTabRoute = () => {
  return <></>;
};

export default NoTabRoute;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let url = context.resolvedUrl;
  if (Object.keys(context.query).length > 0) {
    const split = context.resolvedUrl.split('?');
    url = split[0] + '/quals?' + split[1];
  }
  return {
    redirect: {
      destination: url,
      permanent: false
    }
  };
};
