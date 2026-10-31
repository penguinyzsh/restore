# PS5 用户指南入口的 DNS 与 HTTPS

## 入口流程

[WebKit Autoloader 官方说明](https://github.com/itsPLK/ps5-webkit-autoloader/blob/c560e789aeaf1fca7b4baa30f2eee9054c8ab882/README.md)的首次安装流程是在局域网电脑运行 host，在 PS5 填写该电脑的 DNS 地址并打开用户指南。

[remote-loader 的 host 实现](https://github.com/itsPLK/ps5-webkit-remote-loader/blob/d6666050a910d557f586f401051e8f33e9cc05ee/host.py)按以下顺序提供入口：

1. DNS 服务接收 PS5 对 `manuals.playstation.net` 的查询，返回配置的 IPv4 地址。
2. PS5 连接该地址上的 HTTPS 服务，请求仍使用用户指南域名。
3. HTTPS 服务将指南路径映射到内嵌页面，返回 WebKit 入口。
4. 页面运行利用链和安装器；安装完成并重启后，可从主界面启动 Autoloader。

## HTTPS 与公网部署

[host 构建器](https://github.com/itsPLK/ps5-webkit-remote-loader/blob/d6666050a910d557f586f401051e8f33e9cc05ee/tools/build_host.py)生成用户指南域名的自签名证书，并将证书、私钥及页面嵌入 host。DNS 负责提供地址，HTTPS 负责返回入口页面。

源码支持指定 DNS 应答的 IPv4 地址，以及分别运行 DNS 和 HTTPS 服务。公网方案需要让 PS5 访问 DNS 服务与对应 HTTPS 服务；自有域名站点可以提供引导和下载。公网部署及目标固件 12.40 对证书和入口的处理，留待实机验证。

现有 host 对目标域名以外的查询返回 NXDOMAIN。ReStore 需要安排入口后的域名解析，以便 PS5 继续获取所需文件。
