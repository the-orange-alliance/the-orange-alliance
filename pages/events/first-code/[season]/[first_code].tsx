import { CURRENT_SEASON } from '@/constants';
import TOAProvider from '@/providers/toa-provider';
import { GetServerSideProps, NextPage } from 'next';

const FirstCodePage: NextPage = () => {
  return <></>;
};

export default FirstCodePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  console.log(params);
  const season = params?.season || CURRENT_SEASON;
  const events = await TOAProvider.getAPI().getEvents({ season_key: String(season) });
  const matchingEvents = events.filter(
    e => e.firstEventCode.toLowerCase() === String(params?.first_code).toLowerCase()
  );

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
