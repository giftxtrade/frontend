import { content } from './content'

export const generateAmazonAffiliateLink = (productKey: string): string => {
  return `https://www.amazon.com/dp/${productKey}?tag=${content.ASSOCIATE_TAG}&linkCode=ll1&ie=UTF8&psc=1`
}