import { content } from './content'
import slugify from 'slugify';

export const generateAmazonAffiliateLink = (productKey: string): string => {
  return `https://www.amazon.com/dp/${productKey}?tag=${content.ASSOCIATE_TAG}&linkCode=ll1&ie=UTF8&psc=1`
}

export function eventNameSlug(eventName: string): string {
  return slugify(eventName)
}