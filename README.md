## 设置镜像下载依赖
```
1. 安装 node.js v13

2. 设置镜像
npm config set registry http://registry.npm.taobao.org/
npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass

3. 安装python 2.7
https://www.python.org/downloads/
https://www.python.org/ftp/python/2.7.18/python-2.7.18.amd64.msi

4. 设置 ExecutionPolicy
用管理员权限打开 Windows PowerShell，执行下面的命令，并选择A，表示全部更改。
set-ExecutionPolicy RemoteSigned

npm install

```

### 编译运行
```
npm run serve
```

### 编译打包
```
npm run build
```

### 升级cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
### 管理员运行
```
npm install -g node-gyp
npm install --global --production windows-build-tools
```

### 相关截图
![image](https://user-images.githubusercontent.com/49887877/173271933-0d7c6f64-90f9-4d75-8291-f1ccc812d681.png)
![image](https://user-images.githubusercontent.com/49887877/173272082-550ca3f3-2962-4dec-a186-28a792277479.png)
