// The address we put on screen and in the QR codes. Production lives on a custom domain
// (dalim-play.vercel.app still works but isn't the one to tell people). A local or preview build
// keeps its own address, so phones scanning its code reach the build under test.
export const PUBLIC_HOST = 'iyikidogdundalim.arjendeniz.com'
const PRODUCTION_HOSTS = [PUBLIC_HOST, 'dalim-play.vercel.app']

export const siteOrigin = () =>
  PRODUCTION_HOSTS.includes(location.hostname) ? `https://${PUBLIC_HOST}` : location.origin

/** For link text: the origin without the protocol */
export const siteHost = () => new URL(siteOrigin()).host
