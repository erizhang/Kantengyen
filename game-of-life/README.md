# 生命游戏

浏览器里的康威生命游戏。可以绘制细胞、单步演化、随机填充，也可以放入滑翔机、脉冲星和滑翔机枪。

## 打开

页面使用 ES modules，需要通过本地静态服务器访问：

```bash
cd game-of-life
python3 -m http.server 8080
```

然后打开 [http://localhost:8080](http://localhost:8080)。

## 操作

- 点击或拖拽格子，绘制或擦除细胞
- 空格：运行或暂停
- →：单步
- C：清空
- R：随机

勾选「边界循环」后，从一边离开的细胞会从对面进入。

## 测试

```bash
node --test game-of-life/life.test.mjs
```
