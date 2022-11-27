import { createHmac } from 'crypto';

export const createOpengraphImageUrl = (data: {
  title: string;
  description?: string;
  description1?: string;
  description2?: string;
}) => {
  const dataRaw = JSON.stringify(data);
  const hmac = createHmac('sha256', 'my_secret');
  hmac.update(dataRaw);
  const token = hmac.digest('hex');

  return `/api/opengraph/?token=${token}&data=${encodeURIComponent(dataRaw)}`;
};
