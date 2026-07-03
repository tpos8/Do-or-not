/**
 * DO OR NOT 官网配置
 *
 * 下载量读取自 GitHub Releases：
 * 1. 在 GitHub 仓库右侧进入 Releases
 * 2. 创建 Release，并把 APK 作为附件上传
 * 3. 网页会自动找到最新 APK，并统计所有 Release 中 APK 的累计下载量
 */
const CONFIG = {
  githubOwner: "tpos8",
  githubRepo: "do-or-not",
  assetPattern: /\.apk$/i,
  cacheMinutes: 5,
  maxReleasePages: 5
};

const API_BASE = `https://api.github.com/repos/${CONFIG.githubOwner}/${CONFIG.githubRepo}`;
const RELEASES_PAGE = `https://github.com/${CONFIG.githubOwner}/${CONFIG.githubRepo}/releases`;
const CACHE_KEY = `do-or-not-download-stats-${CONFIG.githubOwner}-${CONFIG.githubRepo}`;
const CACHE_TTL = CONFIG.cacheMinutes * 60 * 1000;

const countElement = document.querySelector("#downloadCount");
const countBottomElement = document.querySelector("#downloadCountBottom");
const metaElement = document.querySelector("#downloadMeta");
const downloadButtons = [
  document.querySelector("#downloadButton"),
  document.querySelector("#downloadButtonBottom")
].filter(Boolean);

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(timestamp));
}

function setDownloadLink(url) {
  downloadButtons.forEach((button) => {
    button.href = url || RELEASES_PAGE;
  });
}

function renderStats(stats, fromCache = false) {
  const total = Number(stats.totalDownloads || 0);
  const countText = total > 0
    ? `已累计下载 ${formatNumber(total)} 次`
    : "安装包等待首次发布";

  if (countElement) countElement.textContent = countText;
  if (countBottomElement) {
    countBottomElement.textContent = total > 0
      ? `${formatNumber(total)} 次累计下载`
      : "发布 APK 后自动显示下载量";
  }

  const sourceText = fromCache ? "缓存数据" : "GitHub Releases";
  if (metaElement) metaElement.textContent = `${sourceText} · ${formatTime(stats.updatedAt)} 更新`;

  setDownloadLink(stats.latestApkUrl || RELEASES_PAGE);
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.updatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(stats) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(stats));
  } catch {
    // 隐私模式或存储被禁用时，忽略缓存错误。
  }
}

async function fetchReleasePage(page) {
  const response = await fetch(
    `${API_BASE}/releases?per_page=100&page=${page}`,
    {
      headers: {
        Accept: "application/vnd.github+json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API 请求失败：${response.status}`);
  }

  return response.json();
}

async function loadDownloadStats() {
  const cached = readCache();

  if (cached) {
    renderStats(cached, true);

    if (Date.now() - cached.updatedAt < CACHE_TTL) {
      return;
    }
  }

  try {
    let releases = [];

    for (let page = 1; page <= CONFIG.maxReleasePages; page += 1) {
      const batch = await fetchReleasePage(page);
      releases = releases.concat(batch);

      if (batch.length < 100) break;
    }

    const publishedReleases = releases.filter(
      (release) => !release.draft
    );

    const apkAssets = publishedReleases.flatMap((release) =>
      (release.assets || [])
        .filter((asset) => CONFIG.assetPattern.test(asset.name))
        .map((asset) => ({
          ...asset,
          releasePublishedAt: release.published_at,
          releasePrerelease: release.prerelease
        }))
    );

    const stableAssets = apkAssets.filter((asset) => !asset.releasePrerelease);
    const preferredAssets = stableAssets.length ? stableAssets : apkAssets;

    preferredAssets.sort(
      (a, b) =>
        new Date(b.releasePublishedAt || b.created_at) -
        new Date(a.releasePublishedAt || a.created_at)
    );

    const stats = {
      totalDownloads: apkAssets.reduce(
        (sum, asset) => sum + Number(asset.download_count || 0),
        0
      ),
      latestApkUrl: preferredAssets[0]?.browser_download_url || RELEASES_PAGE,
      updatedAt: Date.now()
    };

    writeCache(stats);
    renderStats(stats, false);
  } catch (error) {
    console.error(error);

    if (!cached) {
      if (countElement) countElement.textContent = "下载量暂时无法读取";
      if (countBottomElement) countBottomElement.textContent = "可前往 GitHub Releases 下载";
      if (metaElement) metaElement.textContent = "请稍后刷新页面";
      setDownloadLink(RELEASES_PAGE);
    }
  }
}

loadDownloadStats();

// 页面保持打开时，每 5 分钟同步一次；缓存可避免频繁触发 GitHub API 限额。
window.setInterval(loadDownloadStats, CACHE_TTL);
