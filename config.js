/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: process.env.NWF_NAME || 'NodeWeixin开发者交流社区', // 社区名字
  description: process.env.NWF_DESCRIPTION || 'NodeWeixin开发者交流社区', // 社区的描述
  keywords: process.env.NWF_KEYWORDS || '微信支付，微信卡券，微信消息，微信公共号，微信JSSDK，微信',

  // 添加到 html head 中的信息
  site_headers: [
    '<meta name="author" content="EDP@TAOBAO" />'
  ],
  site_logo: process.env.NWF_LOGO || '/public/images/cnodejs_light.svg', // default is `name`
  site_icon: process.env.NWF_ICON || '/public/images/cnode_icon_32.png', // 默认没有 favicon, 这里填写网址
  // 右上角的导航区
  site_navs: [
    // 格式 [ path, title, [target=''] ]
    [ '/about', '关于' ]
  ],
  // cdn host，如 http://cnodejs.qiniudn.com
  site_static_host: process.env.NWF_STORAGE_DODMAIN || '', // 静态文件存储域名

  // 默认的Google tracker ID，自有站点请修改，申请地址：http://www.google.com/analytics/
  google_tracker_id: process.env.NWF_GOOGLE_TRACKER_ID || '',
  // 默认的cnzz tracker ID，自有站点请修改
  cnzz_tracker_id: process.env.NWF_CNZZ_TRACKER_ID || '',

  // mongodb 配置
  db: process.env.NWF_MONGO_DB || 'mongodb://127.0.0.1/nodeforum',

  // redis 配置，默认是本地
  redis: {
    host: process.env.NWF_REDIS_HOST || '127.0.0.1',
    port: (process.env.NWF_REDIS_PORT - 0) || 6379,
    db: (process.env.NWF_REDIS_DB - 0) || 0,
    pass: process.env.NWF_REDIS_PASSWORD || ''
},

  session_secret: process.env.NWF_SESSION_SECRET || 'node_weixin_secret', // 务必修改
  auth_cookie_name: process.env.NWF_COOKIE_NAME || 'node_weixin_cookie',


  // 社区的域名,IP
  host: process.env.NWF_HOST || 'forum.node-weixin.com',
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.NWF_HOST || '127.0.0.1',

  // 程序运行的端口
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.NWF_PORT || 3000,

  // 话题列表显示的话题数量
  list_topic_count: process.env.NWF_TOPIC_LIMIT || 20,

  // RSS配置
  rss: {
    title: process.env.NWF_RSS_TITLE || 'Node微信开发社区',
    link: process.env.NWF_RSS_LINK || 'http://www.node-weixin.com',
    language: process.env.NWF_RSS_LANGUAGE || 'zh-cn',
    description: process.env.NWF_RSS_DESCRIPTION || 'Node微信开发社区',
    //最多获取的RSS Item数量
    max_rss_items: process.env.NWF_RSS_LIMIT || 50
  },

  // 邮箱配置
  mail_opts: {
    host: process.env.NWF_MAIL_HOST || 'smtp.126.com',
    port: process.env.NWF_MAIL_PORT || 25,
    auth: {
      user: process.env.NWF_MAIL_HOST || 'club@126.com',
      pass: process.env.NWF_MAIL_PASSWORD || 'club'
    }
  },

  //weibo app key
  weibo_key: process.env.NWF_WEIBO_KEY,
  weibo_id: process.env.NWF_WEIBO_ID,

  // admin 可删除话题，编辑标签。把 user_login_name 换成你的登录名
  admins: { user_login_name: process.env.NWF_ADMIN || true },

  // github 登陆的配置
  GITHUB_OAUTH: {
    clientID: process.env.NWF_GITHUB_CLIENT_ID || '',
    clientSecret: process.env.NWF_GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.NWF_GITHUB_CALLBACK_URL  || ''
  },
  // 是否允许直接注册（否则只能走 github 的方式）
  allow_sign_up: process.env.NWF_SIGN_UP_ENABLE || false,

  // oneapm 是个用来监控网站性能的服务
  oneapm_key: process.env.NWF_ONEAPM_KEY || '',

  // 下面两个配置都是文件上传的配置

  // 文件上传配置
  // 注：如果填写 qn_access，则会上传到 7牛，以下配置无效
  upload: {
    path: path.join(__dirname, process.env.NWF_UPLOAD_PATH || 'public/upload/'),
    url: process.env.NWF_UPLOAD_URL || '/public/upload/'
  },

  file_limit: process.env.NWF_UPLOAD_FILE_LIMIT || '1MB',

  // 版块
  tabs: [
    ['share', '分享'],
    ['origin', '原创'],
    ['api', 'node-weixin-api'],
    ['express', 'node-weixin-express'],
    ['theory', '原理'],
    ['jssdk', 'js前端']
  ],

  // 极光推送
  jpush: {
    appKey: process.env.JPUSH_APP_KEY,
    masterSecret: process.env.JPUSH_MASTER_SECRET,
    isDebug: false,
  },

  create_post_per_day: 1000, // 每个用户一天可以发的主题数
  create_reply_per_day: 1000, // 每个用户一天可以发的评论数
  visit_per_day: 1000, // 每个 ip 每天能访问的次数
};

module.exports = config;
