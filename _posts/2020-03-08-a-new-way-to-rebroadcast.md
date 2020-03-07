# 转播新方案-自建直播服务器
# 前言：
我是Noripro转播组里一位~~不会整活~~的转播man，最近实验了一种新型转播方式，效果不错，遂与各位分享。  
犬山的直播设置是Ultra Low Latency，只有2-3秒的延迟，也就是只有2-3秒的缓冲时间，而且并不能在直播时实时回放，这就对转播man的网络质量有了极高的要求。这个月组内的转播man各种转圈，更加神必的是，连在日本的朋友也会卡顿，于是我从另一方向思考，能否通过增加缓冲时间(Buffer)保证直播的稳定性。  
![断流图2](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/12b3f9c4d2c3b596.png)  
（心 电 图）  
![断流图1](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/36bae2d3ac28e0b4.png)  
（心 肺 停 止）  
![组内黑屁](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/Screenshot_2020-03-06-20-38-34-149_com.tencent.mo.png)  
（组内黑屁）  
不同方案有不同的好处，本方案也是为各位转播man提供一个新思路而已。

# 简介：
大致上用一张图来解释  
![原理图1](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/9Y4EC3GEELD8V1HLC0.png)  
在转播源和转播服务器(转播man的电脑)之间设置一个RTMP服务器，使其输出TLS加密的HTTP-FLV或HLS直播流，同时在前端浏览或服务器输出直播流时自定义缓冲时间。

# 特性：
1. 自建buffer，保障缓冲速度和稳定性
2. 可自定义buffer大小，在稳定和延迟间寻找平衡点  
3. 使用https传输数据，防***干扰
4. 可边播边录

以下由前端实现：
1. 在遇到卡顿时能继续播放进度，而油管转圈会卡一下，然后中间的视频就没了，对于杂谈直播非常不友好
2. 自适应网络稳定性  
3. 在视频延迟过高时自动追帧  

缺点：
1. 配置麻烦（配置服务器和准备开播时）  
2. 增加延迟（3s以上）

# 配置：
**警告：以下可能只适合于笔者的应用环境，请不要完全参考此部分，因此描述较为粗略，实际操作时请多多查阅相关资料**  
软件上的原理也用一张图表示：
![原理图2](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/EDYFPWK2M9I896QXSL.png)  
笔者在nginx外面套一层Caddy是为了方便配置https(~~就是因为懒~~)  
## 安装软件：  
系统环境：Ubuntu 18.04  
1.	streamlink
https://streamlink.github.io/install.html
2.	最新版ffmpeg
```shell
sudo add-apt-repository ppa:jonathonf/ffmpeg-4
sudo apt update
sudo apt install ffmpeg
```
3.	带rtmp模块的nginx（此处使用nginx-http-flv-module模块）
```shell
#下载解压https://nginx.org/download/nginx-1.16.1.tar.gz
git clone https://github.com/winshining/nginx-http-flv-module/
./auto/configure --add-module=/path/to/nginx-http-flv-module
make
make install
#nginx安装位置：/usr/local/nginx/sbin/nginx
#配置文件：/usr/local/nginx/conf/nginx.conf
```
4. Caddy
```shell
curl https://getcaddy.com | bash -s personal
```
## 配置软件：
1. Caddy:/etc/caddy/config.conf
```conf
live.example.com {
  root /web/main
  proxy /stat http://localhost:7001 {
    transparent
  }
}
live.example.com/stat/ {
  root /web/nginx-rtmp-module/
}
hls.example.com {
  root /web/hls
  header / Cache-Control no-cache
  header / Access-Control-Allow-Origin  *
}
flv.example.com {
  root /web/hls
  proxy / http://localhost:7001 {
    transparent
  }
}
```
2. Nginx:/usr/local/nginx/conf
```conf
rtmp  {
    server  {
        listen 1935;                      #这是RTMP协议默认端口
        chunk_size 4096;                  #可能是每个数据包的大小？
        application hls {                #名为hls的项目
            live on;                      #这是个直播项目
            hls on;                       #开启HLS录制
            wait_key on;                  #让视频流从一个关键帧开始
            hls_path /web/hls;  #HLS录制文件保存的目录
            hls_fragment 2s;              #HLS生成的每个ts文件的时长
            hls_playlist_length 4s;      #每个ts文件的保留时间
            hls_continuous on;            #让HLS标号从上一个结束的位置开始
            hls_cleanup on;               #自动清理过时的ts文件
            hls_nested on;                #为每一个HLS推流项目建立一个新的子目录
            hls_fragment_naming timestamp;
        }
        application flv {
            live on;
            gop_cache on; #打开GOP缓存，减少首屏等待时间
        }
    }
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    access_log  /web/log/nginx-access.log;
    sendfile        on;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       7001;
        server_name  localhost;
        sendfile        on;
        keepalive_timeout  65;

        location /stat {    #第二处添加的location字段。
            rtmp_stat all;
            rtmp_stat_stylesheet /stat/stat.xsl;
        }
        location / {
            flv_live on; #打开HTTP播放FLV直播流功能
            chunked_transfer_encoding on; #支持'Transfer-Encoding: chunked'方式回复
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Credentials' 'true';
        }
    }
}
```

#### 其他参考文章：  
同是Noripro转播组组员@A1ex_inamin 写的在LNMP环境下的配置：  
<https://a1ex.pw/2020/03/03/%E5%9C%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E5%AE%9E%E7%8E%B0%E5%AF%B9YouTube%E4%BD%8E%E5%BB%B6%E8%BF%9F%E7%9A%84%E7%BC%93%E5%86%B2%E4%BB%A5%E6%96%B9%E4%BE%BF%E8%BD%AC%E6%92%AD>  
搭建自己的RTMP+HLS直播服务器：  
<https://candinya.com/posts/%E6%90%AD%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84RTMP-HLS%E7%9B%B4%E6%92%AD%E6%9C%8D%E5%8A%A1%E5%99%A8/>  
支持HTTP-FLV方式直播的开源模块nginx-http-flv-module：  
<https://segmentfault.com/a/1190000016043297>  
Nginx与Nginx-rtmp-module搭建RTMP视频直播和点播服务器：
<https://zhuanlan.zhihu.com/p/28009037>  
NGINX-RTMP实现HLS直播：  
<https://kurisu.love/index.php/archives/118/>  
模块官方文档：  
<https://github.com/arut/nginx-rtmp-module>  
<https://github.com/arut/nginx-rtmp-module/wiki/Directives>  
<https://github.com/winshining/nginx-http-flv-module/blob/master/README.CN.md>  
<https://github.com/winshining/nginx-http-flv-module/wiki/Directives>


# 使用
## 启动Caddy/nginx
```shell
/usr/local/bin/caddy -conf /etc/caddy/config.conf
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```
## 开始推流
#### http-flv模式
`streamlink --hls-live-edge 1 "https://www.youtube.com/watch?v=${ID}" "$FORMAT" -O | ffmpeg -re -i pipe:0 -c copy -f flv rtmp://localhost/flv/${streamname}`  
输出视频流：`https://flv.example.com/?app=flv&stream=${streamname}`
#### hls模式  
`streamlink --hls-live-edge 1 "https://www.youtube.com/watch?v=${ID}" "$FORMAT" -O | ffmpeg -re -i pipe:0 -c copy -f flv rtmp://localhost/hls/${streamname}` 
输出视频流：`https://hls.example.com/${streamname}/index.m3u8`

之后你就可以用VLC插件在OBS里播放啦，然而我在使用VLC时总会遇到些奇奇怪怪的问题，于是用vuejs+dplayer做了个web页面
#### http-flv模式
`http://acedroidx.github.io/live?url=${baseurl}&stream=${streamname}`  
以上面的视频流为例，此处的${baseurl}应为https://flv.example.com/

#### hls模式
`http://acedroidx.github.io/live?url=${url}`


在obs内新建浏览器源，填入以上链接即可  
另外笔者仿造b站做了个自动追帧的功能，url中加入ratelimit参数即可在延迟超过ratelimit+1时以1.2倍速播放，直至延迟小于ratelimit  
前端源码：`https://github.com/AceDroidX/AceDroidX.github.io/blob/master/live.html`
# 实测
本方案从2月13日开始实测（就是当天白雪的特殊推流），经过快一个月的时间，效果不错，~~比直接转播不知道高到哪里去了~~（~~虽然也有一次被Google当作机器人然后玩脱~~）  
测试服务器位于Los Angeles(CN2GIA)
![img1](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/2020-02-15.png)  
![img2](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/2020-03-02(6).png)  
![img3](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/2020-03-06(3).png)  

相对来说笔者更推荐http-flv模式  
由于http-flv模式是真正的实时流，影响延迟的只在streamlink和前端浏览上，因此视频只比油管慢6s左右  
![flv](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/2020-03-06(2).png)  
（甚至可以做到4s延迟）  

hls模式本质是轮询ts文件，如果视频分片设的很小，将会出现建立连接时间长的情况，有时候1s的分片要1.2s下完：  
![hls](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/3efc1c62-41fd-46a2-93a5-a5244917691c.png)  

可能有人会问：为啥不直接用streamlink加--hls-live-edge参数，搞个RTMP服务器是干啥用的？

这个RTMP服务器有两个关键的点
1. 输出HTTP-FLV/HLS直播流，而HTTP-FLV/HLS的外面是一层HTTPS(TLS)协议，至于为什么这个HTTPS很重要我就不能多说了
2. 在hls模式下提供长缓冲

文章难免有疏漏之处，有错误和其它问题欢迎讨论  
最后打个广告：
![img4](https://github.com/AceDroidX/AceDroidX.github.io/raw/master/blog/img/1fe4b31f-3175-4e1e-9386-73c555ab72ad.png)  

本作品采用 [知识共享署名-相同方式共享 4.0 国际许可协议](http://creativecommons.org/licenses/by-sa/4.0/) 进行许可。