# coding=utf-8

# 图片自动转webp
# 将指定目录下的所有图片几乎无损转换成webp格式到新文件夹
# 其他文件直接移动
#
# 食用方法：
# 在main中填入需要转换的目录直接运行即可
#
# 注意：
# 需要从Google官方下载cwebp并配置好PATH环境变量
# cwebp：https://developers.google.com/speed/webp/docs/precompiled?hl=zh-CN
#
# 原理：
# 通过cwebp工具遍历目录图片文件执行cwebp -q 100 inputFiles -o outputFiles
#
# https://AceDroidX.github.io/files/pic2webp.py
# By AceDroidX(wxx)

# V4:
# 添加jpg转换支持

# V3:
# 修复路径识别问题
# 添加tiff转换支持

import os
import time
import shutil

versionCode = 4
inputDir = ""
outputDir = ""
name = "pic2webp.py Version %s" % versionCode
about = "https://AceDroidX.github.io/files/pic2webp.py\nBy AceDroidX(wxx)"


def pic2webp(input):
    global inputDir
    global outputDir
    inputDir = input
    outputDir = input + "_webp"  # 输出文件夹后缀
    print("--------------------------------------------")
    print(name)
    print(about)
    print("--------------------------------------------")
    if not os.path.exists(outputDir):
        os.makedirs(outputDir)
    list_dirs = os.walk(inputDir)
    for root, dirs, files in list_dirs:
        for d in dirs:
            pass
        for f in files:
            if f.endswith(".tif"):
                tif = os.path.join(root, f)
                webp = os.path.join(root, f).replace(inputDir, outputDir).replace(".tif", ".webp")
                cmd(root, tif, webp)
                print("--------- " + tif + " ------> 转换成功")
            elif f.endswith(".tiff"):
                tiff = os.path.join(root, f)
                webp = os.path.join(root, f).replace(inputDir, outputDir).replace(".tiff", ".webp")
                cmd(root, tiff, webp)
                print("--------- " + tiff + " ------> 转换成功")
            elif f.endswith(".png"):
                png = os.path.join(root, f)
                webp = os.path.join(root, f).replace(inputDir, outputDir).replace(".png", ".webp")
                cmd(root, png, webp)
                print("--------- " + png + " ------> 转换成功")
            elif f.endswith(".jpg"):
                jpg = os.path.join(root, f)
                webp = os.path.join(root, f).replace(inputDir, outputDir).replace(".jpg", ".webp")
                cmd(root, jpg, webp)
                print("--------- " + jpg + " ------> 转换成功")
            else:  # 如果为其他扩展名则直接移动
                old = os.path.join(root, f)
                new = os.path.join(root, f).replace(inputDir, outputDir)
                if not os.path.exists(root.replace(inputDir, outputDir)):
                    os.makedirs(root.replace(inputDir, outputDir))
                if os.path.exists(new):
                    new = new.replace(os.path.splitext(new)[1], "-1" + os.path.splitext(new)[1])
                shutil.copy(old, new)
                print("--------- " + old + " ------> 移动成功")


def cmd(root, pic, webp):
    global inputDir
    global outputDir
    if not os.path.exists(root.replace(inputDir, outputDir)):  # 创建输出目录
        os.makedirs(root.replace(inputDir, outputDir))
    if os.path.exists(webp):  # 检查输出目录是否存在文件
        webp = webp.replace('.webp', '-1.webp')
    commandline = "cwebp -q 100 \"%s\" -o \"%s\"" % (pic, webp)
    os.system(commandline)


if __name__ == "__main__":
    # 在此输入需要转换的目录
    pic2webp(r"F:\屏幕快照整理\屏幕快照170127-170809")
