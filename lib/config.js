/**
 * config
 */
/* eslint camelcase: 0 */

var path = require('path');
var title = 'Forim论坛';
var fullname = 'Node开源全栈开者交流社区';
var description = ''

var siteName = process.env.FORIM_SITE_BASE || 'forum.webfullstack.me';

var config = {
  waterline: require('./v2/config/waterline'),
  title: process.env.FORIM_TITLE || title,
  mongoose: {
    trace: process.env.FORIM_MONGOOSE_TRACE || false
  },
  static: {
    path: path.resolve(__dirname, process.env.FORIM_STATIC_PATH || './../public')
  },

  // debug 为 true 时，用于本地调试
  debug: process.env.FORIM_DEBUG || true,
  log4js: {
    appenders: [
      {
        type: 'console',
        category: 'cheese'

        // }, {
        //   type: 'file',
        //   filename: path.resolve(__dirname, process.env.FORIM_LOG_FILE || './logs/cheese.log'),
        //   category: 'cheese',
        //   maxLogSize: process.env.FORIM_LOG_SIZE || 20480,
        //   backups: process.env.FORIM_LOG_BACKUPS || 2
      }
    ]
  },
  self_vote: process.env.FORIM_SELF_VOTE || true,
  name: process.env.FORIM_NAME || fullname, // 社区名字
  description: process.env.FORIM_DESCRIPTION || 'Node开源全栈开发者交流社区', // 社区的描述
  keywords: process.env.FORIM_KEYWORDS || 'Node开源，Node微信开发，Node全栈',

  // 添加到 html head 中的信息
  site: {
    base: siteName
  },
  site_headers: [
    '<meta name="author" content="calidion@gmail.com" />'
  ],
  site_logo: process.env.FORIM_LOGO || '', // default is `name`
  site_icon: process.env.FORIM_ICON || '', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    ['/about', '关于']
  ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: process.env.FORIM_STORAGE_DODMAIN || '', // 静态文件存储域名

  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: process.env.FORIM_GOOGLE_TRACKER_ID || 'UA-71248969-2',
  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: process.env.FORIM_CNZZ_TRACKER_ID || '',

  // mongodb 配置
  db: process.env.FORIM_MONGO_DB_URI || 'mongodb://127.0.0.1/nodeforum',

  // redis 配置，默认是本地
  redis: {
    host: process.env.FORIM_REDIS_HOST || '127.0.0.1',
    port: (process.env.FORIM_REDIS_PORT - 0) || 6379,
    db: (process.env.FORIM_REDIS_DB - 0) || 0,
    password: process.env.FORIM_REDIS_PASSWORD || ''
  },

  session_secret: process.env.FORIM_SESSION_SECRET || 'node_weixin_secret', // 务必修改
  auth_cookie_name: process.env.FORIM_COOKIE_NAME || 'node_weixin_cookie',

  // 社区的域名,IP
  host: process.env.FORIM_HOST || 'forum.webfullstack.me',
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.FORIM_HOST || '0.0.0.0',

  // 程序运行的端口
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.FORIM_PORT || 3000,

  // 话题列表显示的话题数量
  list_topic_count: process.env.FORIM_TOPIC_LIMIT || 20,

  // RSS配置
  rss: {
    title: process.env.FORIM_RSS_TITLE || title,
    link: process.env.FORIM_RSS_LINK || '',
    language: process.env.FORIM_RSS_LANGUAGE || 'zh-cn',
    description: process.env.FORIM_RSS_DESCRIPTION || 'Node全栈开发社区',
    // 最多获取的RSS Item数量
    max_rss_items: process.env.FORIM_RSS_LIMIT || 50
  },

  // 邮箱配置
  mail_opts: {
    host: process.env.FORIM_MAIL_HOST,
    port: process.env.FORIM_MAIL_PORT,
    password: process.env.FORIM_MAIL_PASSWORD,
    email: process.env.FORIM_MAIL_EMAIL,
    secure: process.env.FORIM_MAIL_SECURE || true, // use SSL
    auth: {
      user: process.env.FORIM_MAIL_USER,
      pass: process.env.FORIM_MAIL_PASSWORD
    }
  },

  // weibo app key
  weibo_key: process.env.FORIM_WEIBO_KEY,
  weibo_id: process.env.FORIM_WEIBO_ID,

  // admin 可删除话题，编辑标签。
  // 把登录名放入数组即可
  admins: process.env.FORIM_ADMIN || 'forim',

  // github 登陆的配置
  oauth: {
    github: {
      clientID: process.env.FORIM_GITHUB_CLIENT_ID || 'your GITHUB_CLIENT_ID',
      clientSecret: process.env.FORIM_GITHUB_CLIENT_SECRET || 'your GITHUB_CLIENT_SECRET',
      callbackURL: process.env.FORIM_GITHUB_CALLBACK_URL || 'http://' + siteName + '/oauth/github/callback'
    }
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: process.env.FORIM_SIGN_UP_ENABLE === undefined || true,

  // 下面两个配置都是文件上传的配置

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  // upload: {
  //   path: path.join(__dirname, process.env.FORIM_UPLOAD_PATH || '../public/upload/'),
  //   url: process.env.FORIM_UPLOAD_URL || '/public/upload/'
  // },

  // 上传相关配置
  uploader: {
    default: process.env.FORIM_UPLOADER_DEFAULT || 'disk',  //  可选值：disk, oss, s3, cloudinary
    file_limit: process.env.FORIM_UPLOAD_FILE_LIMIT || '1MB',
    adapters: {

      // 本地磁盘配置
      disk: {
        dir: path.resolve(__dirname, process.env.FORIM_UPLOAD_PATH || '../public/upload/'),
        base: process.env.FORIM_UPLOAD_URL || 'http://' + siteName + '/public/upload'
      },
      // 阿里云 OSS配置
      oss: {
        accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID,
        secretAccessKey: process.env.ALIYUN_OSS_ACCESS_KEY_SECRET,
        endpoint: process.env.ALIYUN_OSS_ENDPOINT,
        apiVersion: process.env.ALIYUN_OSS_APP_VERSION,
        Bucket: process.env.ALIYUN_OSS_BUCKET,
        base: process.env.ALIYUN_OSS_BASE
      },
      s3: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
        endpoint: process.env.AWS_S3_ENDPOINT,
        Bucket: process.env.AWS_S3_BUCKET,
        region: process.env.AWS_S3_REGION,
        progress: function () {
          // 用于表达进度信息
        }
      },
      cloudinary: {
        cloud_name: process.env.FCU_CLOUDINARY_NAME,
        api_key: process.env.FCU_CLOUDINARY_API_KEY,
        api_secret: process.env.FCU_CLOUDINARY_API_SECRET
      }
    }
  },

  // file_limit: process.env.FORIM_UPLOAD_FILE_LIMIT || '1MB',

  // 版块
  tabs: [
    ['share', '分享'],
    ['water', '其它'],
    ['question', '问题'],
    ['projects', '项目']
  ],

  create_post_per_day: process.env.FORIM_POST_LIMIT || 10, // 每个用户一天可以发的主题数
  create_reply_per_day: process.env.FORIM_REPLY_LIMIT || 100, // 每个用户一天可以发的评论数
  visit_per_day: process.env.FORIM_IP_LIMIT || 1000 // 每个 ip 每天能访问的次数
};

module.exports = config;
