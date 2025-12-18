# COLMAP 影像重建速查表（简版提示词）

## 核心概念
- SfM：由特征匹配估计相机位姿并生成稀疏点云；输出内参/外参与少量三角化点。
- MVS：在已知位姿上逐像素估深度/法线，融合成稠密点云，再可网格化。
- 相机 vs 图像：相机是共享内参的实体；图像是磁盘照片，引用某个相机模型。
- 特征/匹配：SIFT 特征，经几何验证后成为内点，用于重建。

## 目录结构（推荐）
```
project/
├─ images/           # 原始图像（可含子目录）
├─ database.db       # SQLite，存特征/匹配
├─ sparse/0/...      # SfM 结果
└─ dense/0/...       # MVS 结果 fused.ply / meshed-*.ply
```

## GUI 快速路径
- File > New project：选 images 目录与 database.db。
- Processing > Extract features：默认 EXIF 自动焦距，必要时勾选 shared intrinsics。
- Processing > Feature matching：小规模用 Exhaustive；序列用 Sequential（带回环）；大规模用 Vocab Tree。
- Reconstruction > Start：增量 SfM；可多模型，必要时 model_converter 合并。
- Reconstruction > Multi-view stereo：undistort → stereo → fuse → meshing。
- Processing > Manage database：检查匹配、相机分组、prior_focal_length。

## CLI 主线（可替代自动重建）
```bash
DATASET=/path/to/project

colmap feature_extractor --database_path $DATASET/database.db --image_path $DATASET/images
colmap exhaustive_matcher --database_path $DATASET/database.db
mkdir -p $DATASET/sparse
colmap mapper --database_path $DATASET/database.db --image_path $DATASET/images --output_path $DATASET/sparse

mkdir -p $DATASET/dense
colmap image_undistorter --image_path $DATASET/images --input_path $DATASET/sparse/0 --output_path $DATASET/dense --output_type COLMAP --max_image_size 2000
colmap patch_match_stereo --workspace_path $DATASET/dense --workspace_format COLMAP --PatchMatchStereo.geom_consistency true
colmap stereo_fusion --workspace_path $DATASET/dense --workspace_format COLMAP --input_type geometric --output_path $DATASET/dense/fused.ply
colmap poisson_mesher --input_path $DATASET/dense/fused.ply --output_path $DATASET/dense/meshed-poisson.ply
```

## 特征与匹配要点
- GPU SIFT 默认；无显示或硬件不足时加 `--FeatureExtraction.use_gpu 0` / `--FeatureMatching.use_gpu 0`。
- 共享内参仅限同尺寸同焦距照片；否则拆分相机。
- 匹配模式：Exhaustive（质优，小规模）、Sequential（视频/序列）、Vocab Tree（大规模检索）、Spatial（GPS 近邻）、Transitive（补全）、Custom（手工配对或导入匹配）。

## 重建与导出
- SfM 失败时先增匹配或指定初始对；注册率低通常因覆盖不足。
- MVS 阶段卡顿/显存不足时减分辨率或拆分场景，见 FAQ freeze/memory。
- 导出：File > Export / Export all（COLMAP txt/bin、PLY 等）；导入：File > Import / Import From...

## 可视化
- SfM 点云：在 GUI 导入 cameras.txt / images.txt / points3D.txt 所在目录。
- 稠密点云：导入 fused.ply；网格需用 Meshlab 等外部工具查看。
