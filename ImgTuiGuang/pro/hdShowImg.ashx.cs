using System;
using System.Collections.Generic;
using System.Web;
using WeChatTools.Core;

namespace ImgTuiGuang
{
    /// <summary>
    ///  微信公众号文章图片中转,突破微信反盗链限制
    /// </summary>
    public class hdShowImg : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
           
            getImg(context);

          
        }
        
        private void getImg(HttpContext context)
        {
            HttpHelper helper = new HttpHelper();
     
            string hosturl = ConfigTool.ReadVerifyConfig("wxShowImg", "Other");//这些域名都需要指向用户最终要访问的站点
            string[] sArray = hosturl.Split(',');
            Random ran = new Random();
            int RandKey1 = ran.Next(0, sArray.Length);//随机选中action
            string imgName = sArray[RandKey1];

            string url = "http://" + context.Request.Url.Authority + "/img/wechat/" + imgName;

            HttpItem item = new HttpItem()
            {

                URL = url,
                Referer = "",//必填参数,这里置空

                UserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2",//useragent可有可无
                ResultType = ResultType.Byte

            };

            HttpResult res = helper.GetHtml(item);

            string code = "data:image/webp;base64," + Convert.ToBase64String(res.ResultByte);
            context.Response.ContentType = "image/webp";
            context.Response.OutputStream.Write(res.ResultByte, 0, res.ResultByte.Length);
        }


        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}