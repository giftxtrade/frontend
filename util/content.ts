export const content = {
  ASSOCIATE_TAG: "giftxtrade0a-20",
  GTAG: "G-2WM8TF71MK",
  BASE_TITLE: "Gift Exchange, Made Simple - GiftTrade",
  DESCRIPTION: "Make your Gift Exhange and Secret Santa simple and secure with GiftTrade"
}

export const toStringOrUndefined = (val: string[] | string | undefined) => {
  return typeof (val) === 'object' ? val[0] : val;
}

export const toStringOrNull = (val: string[] | string | undefined) => {
  return typeof (val) === 'object' ? val[0] : val ? val : null;
}

export const changeProfileSize = (imageUrl: string, size: number): string => {
  const imageUrlIdentifier = imageUrl.split('=');
  const main = imageUrlIdentifier[0];
  return `${main}=s${size}`;
}