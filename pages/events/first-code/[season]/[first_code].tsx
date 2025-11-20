import TOAProvider from '@/providers/toa-provider';
import { GetServerSideProps, NextPage } from 'next';

const FirstCodePage: NextPage = () => {
  return <></>;
};

export default FirstCodePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const events = await TOAProvider.getAPI().getEvents({ season_key: String(params?.season) });
  const matchingEvents = events.filter(e => e.firstEventCode === String(params?.first_code));

  if (matchingEvents.length !== 1) {
    return {
      notFound: true
    };
  }

  return {
    redirect: {
      permanent: true,
      destination: `/events/${matchingEvents[0].eventKey}`
    }
  };
};
