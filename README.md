# 库存管理系统部署说明

这个文件夹可以直接上传到 Vercel。

## 方法一：网页上传

1. 打开 https://vercel.com/new
2. 选择导入项目，或使用 Vercel Dashboard 的部署入口。
3. 上传/导入这个文件夹：`inventory_vercel_site`
4. Framework Preset 选择 `Other`。
5. Build Command 留空。
6. Output Directory 留空或填 `.`。
7. 部署完成后，Vercel 会给你一个 `https://xxx.vercel.app/` 网址。

## 方法二：GitHub

1. 把这个文件夹作为一个 GitHub 仓库上传。
2. 在 Vercel 里 Import Git Repository。
3. Framework Preset 选择 `Other`。
4. 部署完成后即可获得公开网址。

库存数据已经写在 `index.html` 里，别人打开网址不需要访问你的电脑。
