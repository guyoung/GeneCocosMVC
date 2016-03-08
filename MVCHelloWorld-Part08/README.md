MVCHelloWorld：Cocos2d-js MVC模块化开发（08）
===========================================

总结


## 低耦合


Mediator和Proxy之间、Mediator和其他Mediator之间的耦合。


View本质上是显示Model的数据并让用户能与之交互，我们期望一种单向依赖，即View依赖于Model，而Model却不依赖于View。View必须知道Model的数据是什么，但Model却并不需要知道View的任何内容。


虽然Mediator可以任意访问Proxy，通过Proxy的API读取、操作Data Object，但是，由Command来做这些工作可以实现View和Model之间的松耦合。


如果一个Mediator要和其他Mediator通信，那它应该发送Notification来实现，而不是直接引用这个Mediator来操作。Mediator对外不应该公布操作View Component的函数。而是自己接收Notification做出响应来实现。




## 参考

+ [PureMVC](http://puremvc.org/)
+ [browserify](http://browserify.org/)
+ [uglifyjs](http://lisperator.net/uglifyjs/)



------------------------------------------------

**Guyoung Studio**
 + Official Site: <a href="http://www.guyoung.net/" target="_blank">www.guyoung.net</a>
 + Email:         <a href="&#109;&#97;&#105;&#108;&#116;&#111;&#58;%67%75%79%6f%75%6e%67@%61%6c%69%79%75%6e.%63%6f%6d" target="_blank">guyoung[at]aliyun.com</a>