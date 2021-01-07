import 'dotenv/config'

export default {
  secret: process.env.APP_SECRET || 'appSecret'
}
