# CS Skin AMM Dashboard

CS Skin AMM Dashboard 是一个用于 CS2 饰品跨平台利差监控、报价归一、平台覆盖管理和执行前预检的 dashboard 项目。

当前版本聚焦在三件事：

- 将套利机会拆分为“即时成交机会”和“挂单观察机会”，避免把理论价差误判为可立即成交。
- 建立统一的平台目录和接入矩阵，按 CSGOSKINS.GG markets 目录纳入 32 个市场。
- 提供一个可运行的利差机会中心，展示毛/净利差排序、利差区间筛选、费用拆解、流动性检查、报价矩阵、平台接入状态和交易所连通性。

## 当前边界

当前版本是执行前预检系统，不是实盘交易系统：

- 不连接真实交易平台账号。
- 不读取账号、会话、Cookie、Access Key、支付信息或 Steam 令牌。
- 不执行真实买入、卖出、挂单、撤单、充值、提现或资产交割。
- 内置行情、库存、余额和费率只用于验证计算模型与页面结构。
- 所有真实平台的行情、账户、费率、执行和对账能力都必须通过 adapter 逐平台接入。

## 核心能力

| 能力 | 说明 |
| --- | --- |
| 机会拆分 | 区分即时成交机会与挂单观察机会 |
| 毛/净利差计算 | 同时输出毛利润、净利润、毛利差、净利差、手续费估算、充值成本和总成本率 |
| 流动性检查 | 按 bid/ask VWAP、深度、滑点、库存、余额和平台健康度过滤 |
| 平台覆盖 | 按 CSGOSKINS.GG markets 目录纳入 32 个市场 |
| 样例行情覆盖 | 为 32 个目录平台生成确定性样例盘口，参与报价矩阵和利差排序 |
| 机会排序筛选 | 支持按净利差、毛利差、净利润、手续费排序，并按最低/最高利差和买卖交易所筛选 |
| 接入矩阵 | 每个平台都有来源、市场统计、必备能力和当前状态 |
| 交易所列表 | 以左侧 tab dashboard 展示所有支持平台、连通性、HTTP 状态和延迟 |
| 执行预检 | 在进入任何真实操作前生成可审查预案 |
| 文档导出 | 支持将需求、开发、数据采集、平台矩阵和恢复说明导出为 PDF |

## 机会类型

| 类型 | 业务含义 | 利差性质 | 处理方式 |
| --- | --- | --- | --- |
| 即时成交机会 | A 侧卖给已有求购订单，B 侧从现货卖盘同步补货 | 即时利差 | 可进入下一步人工审核 |
| 挂单观察机会 | B 侧买入成本低于 A 侧目标挂单价 | 理论利差 | 仅进入观察池 |

## 平台目录

平台列表来自 CSGOSKINS.GG markets 目录。当前已纳入 32 个市场：

Steam、CSFloat、LIS-SKINS、CS.MONEY、Skinport、Tradeit.gg、BUFF163、GameBoost、DMarket、CS2、PirateSwap、SkinSwap、Skin.Land、Avan.market、Skinflow、Aim.market、Mannco.store、white.market、SkinBaron、SkinPlace、BUFF Market、ShadowPay、WAXPEER、SkinOut、CS.TRADE、Skinvault、UUSKINS、Skins.com、HaloSkins、Exeskins、NTSkins、Dupe。

说明：纳入目录和样例行情覆盖不等于已完成真实交易接入。当前系统用目录级样例盘口完成 32 平台报价矩阵和利差排序，同时明确标记真实行情、费率、库存、余额、执行和对账能力的正式接入状态。

## 目录结构

```text
.
├── apps/
│   └── spread-oracle/
│       ├── public/              # dashboard 静态页面
│       ├── src/                 # 服务端、价格计算、平台目录
│       └── test/                # smoke test
├── docs/                        # 需求、开发、数据采集、平台矩阵和 PDF
├── tools/                       # 文档渲染工具
├── .gitignore
└── README.md
```

## 本地运行

进入应用目录：

```bash
cd apps/spread-oracle
npm start
```

默认监听端口为 `4873`。可通过环境变量调整：

```bash
HOST=0.0.0.0 PORT=4873 npm start
```

## 验证

```bash
cd apps/spread-oracle
npm run check
npm run smoke
```

| 命令 | 作用 |
| --- | --- |
| `npm run check` | 检查服务端、前端脚本、样例数据、平台目录和测试文件语法 |
| `npm run smoke` | 验证机会拆分、毛/净利差、费用拆解、平台目录数量、筛选控件和执行预检输出 |

## 服务器运行

推荐用 systemd 托管服务，避免手动后台进程退出后无人拉起。仓库提供了服务模板：

```text
deploy/cs-amm-spread-oracle.service
```

该服务使用 `Restart=always`，并将日志写入应用目录下的 `server.log`。部署到服务器后执行：

```bash
systemctl daemon-reload
systemctl enable --now cs-amm-spread-oracle.service
```

## API

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| `/api/health` | GET | 健康检查 |
| `/api/snapshot` | GET | 完整快照，包含机会、报价矩阵和平台覆盖 |
| `/api/platforms` | GET | 平台目录、市场统计和接入状态 |
| `/api/platform-connectivity` | GET | 平台连通性快照，包含状态、延迟、HTTP 状态和探测目标 |
| `/api/opportunities` | GET | 机会列表 |
| `/api/opportunities/:id` | GET | 机会详情 |
| `/api/precheck` | POST | 根据 opportunityId 生成执行前预检 |
| `/api/dry-run` | POST | 兼容旧接口，返回同一类预检结果 |

## 文档

| 文件 | 说明 |
| --- | --- |
| `docs/需求文档.md` | 产品需求、业务边界、机会类型和验收标准 |
| `docs/开发文档.md` | 工程模块、接口、数据模型和测试策略 |
| `docs/数据采集与价格预言机.md` | 盘口、VWAP、报价归一和流动性规则 |
| `docs/平台接入矩阵.md` | 32 个市场的目录字段、能力字段和接入状态 |
| `docs/验收复查.md` | 当前要求与文档要求的逐项复查结果 |
| `docs/恢复说明.md` | 当前恢复内容和后续路线 |
| `docs/恢复文档合集.pdf` | 文档合集导出件 |

重新生成 PDF：

```bash
python tools/render-docs.py
```

## 后续接入顺序

1. 只读公开行情和盘口。
2. 只读近期成交和平台费率。
3. 账户授权后的库存与余额只读同步。
4. 执行前预检自动化。
5. 用户授权范围内的受控执行任务。
6. Steam Mobile 人工确认闭环。
7. 订单、库存、余额和盈亏对账。
