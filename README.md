# DO OR NOT 官网

这是一个可直接部署到 **GitHub Pages** 的静态 App 官网，包含：

- 简约东方视觉风格
- 手机框截图展示
- Android APK 下载按钮
- GitHub Releases 实时累计下载量
- 响应式手机 / 平板 / 桌面布局

## 目录

```text
do-or-not-website/
├── index.html
├── styles.css
├── app.js
├── .nojekyll
└── assets/
    ├── app-icon.png
    ├── wordmark.png
    └── screenshots/
```

## 实时下载量如何工作

网页通过 GitHub 官方 API 读取：

```text
https://api.github.com/repos/tpos8/tpos8/releases
```

它会：

1. 查找所有 GitHub Releases 中以 `.apk` 结尾的附件；
2. 累计这些 APK 的 `download_count`；
3. 将两个下载按钮自动指向最新发布的 APK；
4. 每 5 分钟刷新一次，并使用浏览器缓存减少 API 请求。

> GitHub 只统计通过 Release 附件链接产生的下载。直接放在仓库文件中的 APK 不会提供下载次数。

## 发布 APK

1. 打开仓库：`https://github.com/tpos8/tpos8`
2. 点击右侧 **Releases**
3. 点击 **Draft a new release**
4. 创建版本标签，例如 `v1.0.0`
5. 将 APK 拖到附件区域，例如：`do-or-not-v1.0.0.apk`
6. 发布 Release

发布完成后，网页会自动显示累计下载量并链接到最新版 APK，无需修改 HTML。

## 修改 GitHub 仓库

打开 `app.js`，修改：

```js
const CONFIG = {
  githubOwner: "tpos8",
  githubRepo: "tpos8",
  assetPattern: /\.apk$/i
};
```

如果以后把 App 放到另一个仓库，只需要修改 `githubOwner` 和 `githubRepo`。

## 部署到 GitHub Pages

### 方法一：上传到仓库根目录

把压缩包解压后的全部内容上传到仓库根目录，然后：

1. 进入仓库 **Settings**
2. 打开 **Pages**
3. `Source` 选择 **Deploy from a branch**
4. Branch 选择 `main`
5. Folder 选择 `/ (root)`
6. 保存

稍等一两分钟后，页面通常会出现在：

```text
https://tpos8.github.io/tpos8/
```

### 方法二：放入 docs 文件夹

也可以将全部文件放进 `docs/`，然后在 Pages 设置里选择 `main /docs`。

## 本地预览

直接双击 `index.html` 可以查看页面。  
为了避免部分浏览器限制，也可以在目录中运行：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 注意

- 页面使用 Google Fonts；无法访问时会自动使用系统字体，不影响主要布局。
- GitHub 未创建 Release 或未上传 APK 时，下载按钮会跳转到 Releases 页面。
- GitHub API 对匿名访问存在频率限制，因此页面默认每 5 分钟更新，而不是每秒请求。
