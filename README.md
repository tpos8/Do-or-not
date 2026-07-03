# DO OR NOT 官网 · v1.0.2

这是可直接部署到 **GitHub Pages** 的静态官网版本，已新增独立的 **v1.0.2 更新页**。

## 本次网页更新

- 首页新增 `v1.0.2 已发布` 入口和更新预告区；
- 新增 `update-1.0.2.html` 完整版本介绍页；
- 展示第一反应、签册、结果回访、月度洞察、AI 问题整理、每日宜忌等功能；
- 加入 5 张去除个人手机状态栏标志后的新版手机预览图；
- 下载按钮连接 `tpos8/do-or-not` GitHub Releases；
- 保留 GitHub Releases 实时累计下载量；
- 支持桌面端、平板和手机端响应式显示。

## 目录结构

```text
do-or-not-v1.0.2-website/
├── index.html
├── update-1.0.2.html
├── privacy.html
├── styles.css
├── app.js
├── CNAME
├── .nojekyll
└── assets/
    ├── app-icon.png
    ├── wordmark.png
    ├── screenshots/
    │   ├── splash.png
    │   ├── question.jpg
    │   ├── shake.jpg
    │   └── result.jpg
    └── updates/
        ├── home-preview.png
        ├── splash-preview.png
        ├── signbook-preview.png
        ├── decision-detail-preview.png
        └── insight-preview.png
```

## 部署

将文件夹内的全部内容上传到 `tpos8/do-or-not` 仓库根目录，然后在 GitHub：

1. 打开 **Settings → Pages**；
2. Source 选择 **Deploy from a branch**；
3. Branch 选择 `main`，Folder 选择 `/ (root)`；
4. 保存并等待部署完成。

项目已保留 `CNAME`，自定义域名为：

```text
do.smallorbit.cn
```

## 发布 v1.0.2 APK

在仓库的 **Releases** 中创建标签 `v1.0.2`，上传类似下面名称的安装包：

```text
do-or-not-v1.0.2.apk
```

网页会自动统计所有 APK 附件的累计下载量，并将下载按钮指向最新稳定版 APK。

## 本地预览

```bash
python3 -m http.server 8000
```

浏览器访问：

```text
http://localhost:8000
```
