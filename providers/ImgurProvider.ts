const baseUrl = 'https://api.imgur.com/3';
const clientId = '0e76f4508feb80d';

export type ImgurResponse = {
  data: {
    account_id: number;
    account_url: string | null;
    ad_type: number;
    ad_url: string;
    animated: boolean;
    bandwidth: number;
    datetime: number;
    deletehash: string;
    description: string | null;
    edited: string;
    favorite: boolean;
    has_sound: boolean;
    height: number;
    id: string;
    in_gallery: boolean;
    in_most_viral: boolean;
    is_ad: boolean;
    link: string;
    name: string;
    nsfw: string | null;
    section: string | null;
    size: number;
    tags: string[];
    title: string | null;
    type: string;
    views: string | number;
    vote: string | null;
    width: number;
  };
  status: number;
  success: boolean;
};

export const uploadToImgur = (image: string): Promise<ImgurResponse> => {
  return new Promise<ImgurResponse>((resolve, reject) => {
    const headers = { Authorization: `Client-ID ${clientId}`, 'content-type': 'application/json' };

    fetch(baseUrl + '/image', {
      method: 'POST',
      body: JSON.stringify({ image: image }),
      headers: headers
    })
      .then(res => res.json())
      .then(
        (data: ImgurResponse) => {
          if (data && data.success) {
            resolve(data);
          } else {
            reject(data);
          }
        },
        (err: any) => {
          reject(err);
        }
      );
  });
};
