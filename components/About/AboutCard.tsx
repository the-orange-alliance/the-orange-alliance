import AboutPerson from '../../lib/models/AboutPerson';
import { Box } from '@mui/system';
import { Card, CardContent, Divider, IconButton, Typography } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';

const AboutCard = ({ person }: { person: AboutPerson }) => {
  return (
    <>
      <Box>
        <Card
          style={{
            background: 'linear-gradient(0deg, #fff calc(100% - 110px), #fef5e8 calc(100% - 110px))'
          }}
        >
          <CardContent>
            <Box>
              <Box>
                <Typography variant={'h6'}>{person.name}</Typography>
                <Typography style={{ color: 'gray' }} variant={'subtitle2'}>
                  {person.title}
                </Typography>
              </Box>

              <img
                src={`/imgs/bio_photos/${person.imgName}`}
                alt={`${person.name} profile photo`}
                style={{ borderRadius: '50%', height: '70px', marginTop: '10px' }}
              />

              <Box>
                <div dangerouslySetInnerHTML={{ __html: person.description }} />
              </Box>
            </Box>
          </CardContent>
          {(person.github || person.linkedIn) && (
            <>
              <Divider />
              <CardContent sx={{ pb: '10px !important', pt: 1, mb: 0 }}>
                <Box style={{ float: 'right', marginBottom: '10px' }}>
                  {person.github && (
                    <IconButton href={person.github} target={'_blank'} sx={{ mr: 2, p: 0 }}>
                      <GitHub />
                    </IconButton>
                  )}
                  {person.linkedIn && (
                    <IconButton href={person.linkedIn} target={'_blank'} sx={{ m: 0, p: 0 }}>
                      <LinkedIn />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </>
          )}
        </Card>
      </Box>

      <style jsx>{`
        .dev-card {
          padding: 0 !important;
          margin: 0 8px;
        }

        .dev-card::before {
          background: #fef5e8;
          content: '';
          display: block;
          height: 110px;
          width: calc(100% - 16px);
          position: absolute;
        }

        .dev-card .profile {
          background-color: #00bcd4;
          border-radius: 50%;
          height: 64px;
          left: 30px;
          pointer-events: none;
          position: absolute;
          top: 110px;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          width: 64px;
        }

        .dev-card .title {
          align-content: center;
          display: flex;
          flex: 1 0 auto;
          flex-direction: column;
          line-height: 22px;
          justify-content: center;
          position: absolute;
        }

        .dev-card .content {
          height: 100%;
          padding: 15px 30px 0;
          position: relative;
        }

        .dev-card .content .text {
          margin-top: 140px;
          margin-bottom: 15px;
          padding: 0 !important;
        }
      `}</style>
    </>
  );
};

export default AboutCard;
