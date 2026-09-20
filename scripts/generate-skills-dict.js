/**
 * Antigravity Chinese Localization - Skill Dictionary Generator
 * 126+ 个技能插件 YAML description 高质量专业中文翻译生成器
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS = {
  // 1. 通用、系统与 Web
  "android-cli": "提供使用 Android 命令行工具 (CLI) 管理设备、模拟器、SDK 组件及构建项目的详细指南。",
  "caveman": "极致压缩沟通模式，在保留完整技术精确度的同时大幅精简输出 Token。层级包括：lite、full、ultra 及其文言变体。适用于 /caveman、“洞穴人模式”、“简短回复”等场景。",
  "uv": "检测系统是否已安装 uv Python 包管理器，若缺失则自动安装并确保 uv 已加入 PATH 环境变量。在其他技能依赖 uv 前置环境时使用。",
  "google-antigravity-sdk": "使用 Google Antigravity Python SDK 构建 AI 智能体应用。",
  "google-maps-platform": "Google Maps Platform 官方 API 的集成技能与调用工具集。",
  "chrome-extensions": "遵循 Manifest V3 最佳实践构建并发布 Chrome 浏览器扩展。当用户需要创建、修改、调试或理解 Chrome 扩展、插件、manifest.json、content script、service worker、popup、侧边栏面板、chrome.* API 或准备上架 Web Store 时触发。",
  "modern-web-guidance": "现代 Web 前端开发最佳实践搜索引擎。所有涉及 HTML/CSS 及客户端 JS 任务必须优先执行。用于检索弹窗/模态框、毛玻璃效果、锚点定位、容器查询、视图过渡、滚动驱动动画、核心 Web 指标 (LCP/INP) 优化等前沿前端技术规范。",

  // 2. Chrome DevTools 诊断与调试
  "a11y-debugging": "基于 web.dev 规范，利用 Chrome DevTools MCP 进行无障碍可访问性 (a11y) 调试与全面审计。适用于测试语义化 HTML、ARIA 标签、焦点状态、键盘导航、点击热区尺寸及色彩对比度。",
  "chrome-devtools": "通过 MCP 调用 Chrome DevTools 进行高效调试、故障排查与浏览器自动化操作。适用于调试网页控制台、自动化浏览器交互、分析页面性能或检查网络请求。",
  "debug-optimize-lcp": "利用 Chrome DevTools MCP 工具诊断并优化最大内容绘制 (LCP) 性能。当用户询问 LCP 性能瓶颈、首屏加载缓慢、核心 Web 指标 (CWV) 优化或主内容渲染延迟时使用。",
  "memory-leak-debugging": "诊断并解决 JavaScript / Node.js 应用程序中的内存泄漏问题。当用户报告高内存占用、OOM 崩溃或需要使用 Chrome DevTools 捕获、对比与分析堆内存快照 (Heap Snapshot) 时触发。",
  "troubleshooting": "使用 Chrome DevTools MCP 及官方文档排查连接与调试目标故障。当 list_pages、new_page 或 navigate_page 失败，或 DevTools 服务初始化异常时触发。",

  // 3. GCP & Data Agent Kit 核心管道
  "accidental-data-loss-prevention": "防止意外数据丢失保护门禁：在执行任何可能导致不可逆数据删除的危险命令或工具前，必须获得用户明确授权。适用于 DROP/TRUNCATE/DELETE SQL、gsutil/gcloud 存储桶删除、项目销毁、密钥清除等操作。",
  "bigquery-ai-ml": "利用 BigQuery 内置机器学习与生成式 AI 能力进行高级数据分析。适用于编写 SQL 执行时间序列预测、异常值检测、关键驱动因素挖掘或 BigQuery 内部大模型推理任务。",
  "bigquery-bigframes": "使用 BigQuery DataFrames (BigFrames) 生成类 pandas / scikit-learn 风格的 Python 数据分析与机器学习代码。适用于在 Notebook 中以 DataFrame 形式处理 BigQuery 数据。",
  "bigquery-data-transfer-service": "发现与检查 BigQuery 数据传输服务 (DTS) 配置。用于识别已有数据摄取管道，提取数据源元数据与传输配置，处理数据导入与同步场景。",
  "bigquery-graph": "提供在 BigQuery 中使用 GQL (Graph Query Language) 定义与查询属性图和语义图的最佳实践规范与指导。",
  "bigquery-sql": "提供 BigQuery SQL 查询优化技术、执行最佳实践与性能调优规则。适用于优化复杂 SQL 查询、降低计算成本及设计高性能 SQL 转换流水线。",
  "bigtable-basics": "协助在 Bigtable 中预配实例与数据表、设计高性能 RowKey 行键模式、配置列族与查询数据。用于诊断热点问题、调优吞吐性能或使用 gcloud / cbt 命令行管理集群。",
  "building-data-apps": "使用 React + Vite 或 Streamlit 构建现代数据应用、可视化仪表板与交互式报表，支持集成 Gemini Data Analytics 实现智能数据对话体验。",
  "dataform-bigquery": "生成规范、正确且高效的 BigQuery ELT 数据建模流水线代码。适用于创建或修改 Dataform 管道、SQLX 转换定义、数据源声明、GCS 摄取或配置 workflow_settings.yaml。",
  "data-autocleaning": "面向 Dataform / dbt / BigQuery 管道的自动化数据清洗与模式转换套件。处理来自 BigQuery 或 Cloud Storage 的原始数据，应用规范化摄取、字段映射及全方位数据质量清洗规则。",
  "dbt-bigquery": "针对 BigQuery 的 dbt 管道开发、优化与故障排查专家指南。适用于创建与修改 dbt 模型、优化模型 SQL、初始化新 dbt 项目或重构现有流水线。",
  "discovering-gcp-data-assets": "在 Google Cloud 中检索与检查数据资产。适用于查找 BigQuery 数据集/表/视图、BigLake 目录、Spanner 实例/数据库，获取模式 Schema、元数据与管控策略。",
  "enforcing-resource-attribution": "执行命令行资源的标签与归属合规。在通过 run_command 运行 bq 或 gcloud 命令时，确保强制添加必要标签，避免无标签或只读命令传参错误。",
  "federate-lakehouse-catalog": "将 Google Cloud Lakehouse 联合目录连接到远程 Iceberg REST 目录（如 Databricks Unity Catalog、AWS Glue），实现从 BigQuery 或 Spark 跨云联合查询远程数据。",
  "gcloud-auth-verification": "排查与修复 Google Cloud CLI (gcloud) 及应用默认凭据 (ADC) 的身份验证故障。当 gcloud、bq、dataform 或 Python 库报错 401/403 凭据失效时使用。",
  "gcp-composer-troubleshooting": "Cloud Composer (Apache Airflow) 与编排管道的故障排查专家指导。用于生成根本原因分析 (RCA) 报告、定位并修复失败的 DAG 与任务流。",
  "gcp-dataflow": "指导在 Dataflow 上编写、打包、执行与调优 Apache Beam 流批一体管道。涵盖 Java/Python/Go 项目搭建、Flex 模板构建、作业健康度与自动扩缩容深度诊断。",
  "gcp-data-pipelines": "在 Google Cloud 上构建、管理与编排数据管道的统一入口。引导用户根据需求选择 dbt、Dataflow (Beam)、Dataform、Spark (Dataproc) 或 Cloud Composer 解决方案。",
  "gcp-managed-airflow-dag-authoring": "Cloud Composer / MSAA 托管 Airflow 环境下的 DAG 编写与验证专家指南。涵盖 Airflow 2 与 3 兼容性、上下文发现与本地/远程语法验证流程。",
  "gcp-managed-airflow-migrations": "Cloud Composer / MSAA 环境下的 Airflow DAG 迁移指南。指导平滑迁移至 Airflow 2.11.1 或 Airflow 3，涵盖破坏性变更扫描与依赖升级。",
  "gcp-managed-airflow-recommendations": "Cloud Composer 托管 Airflow 环境的创建、调优、资源扩缩容与高可用最佳实践。用于防止工作负载重启并分析集群健康状态。",
  "gcp-pipeline-orchestration": "帮助生成或更新 Google Cloud Composer 编排流水线定义，调度与编排 dbt、Jupyter 笔记本、Spark 作业、Dataform、Python 脚本或内嵌 SQL 查询。",
  "gcp-pipeline-resource-provisioning": "基于 deployment.yaml 声明式自动化预配数据管道所需的各项 GCP 基础设施资源（支持 BigQuery、Dataform、Dataproc、DTS 等）。",
  "gcp-spark": "在 Google Cloud 托管 Spark（Dataproc 集群及 Serverless）上开发与执行 Spark / PySpark ETL 流水线及机器学习代码，支持读写 BigLake、BigQuery 与 Spanner。",
  "gcs-security-assessment": "评估 Google Cloud Storage (GCS) 存储桶与项目的数据安全态势。检测公共访问暴露、IAM 权限过宽、CMEK 加密合规、VPC 服务控制及审计日志完备性。",
  "google-cloud-auth-verification": "强制执行的第 0 步安全准入：验证 Google Cloud Platform (GCP)、ADC 凭据、gcloud CLI、BigQuery 及 GCS 运行时的鉴权状态。",
  "google-cloud-storage-basics": "Cloud Storage (GCS) 核心对象管理：创建与配置存储桶、上传下载数据、配置 IAM 权限、存储类型分层、生命周期规则、防删除保护及客户端 SDK 调用。",
  "google-cloud-storage-bucket-architect": "设计高安全性、低成本且符合最佳实践的 GCS 存储桶架构。根据业务场景自动规划地理位置、存储等级、统一存储桶级别访问控制与保留策略。",
  "google-cloud-storage-fuse": "使用 Cloud Storage FUSE (gcsfuse) 将 GCS 存储桶挂载为 POSIX 本地文件系统。优化 GKE、Compute Engine 或 Cloud Run 上的挂载性能、缓存与并发写入安全。",
  "managing-python-dependencies": "规范化 Python 依赖管理指南：杜绝全局 pip install，严格遵循项目级虚拟环境、uv / poetry / pip-tools 工具链与版本锁定最佳实践。",
  "ml-best-practices": "机器学习与数据分析核心规范：涵盖聚类、分类、回归、时序预测、假设检验、模型评估对比的标准分析流程与 BigQuery ML 规范。",
  "notebook-guidance": "Jupyter Notebook 数据分析、探索与可视化专家指南。规范单元格执行顺序、%%bqsql 语法集成、图表绘制与自动化清理流程。",
  "resolving-mcp-region-configs": "区域级 Google Cloud MCP 服务（如 Dataproc）连接配置修复：自动检测并替换未解析的 $GCP_REGION 占位符，修复 MCP 工具连接报错。",
  "schema-mapping": "数据库与数据仓库模式映射规划指南：在编写代码前，系统性梳理并输出源表与目标表之间的字段转换与映射规约清单 (Mapping Manifesto)。",

  // 4. Firebase & 移动端开发
  "firebase-ai-logic-basics": "将 Firebase AI Logic (Gemini API) 深度集成到 Web 与移动端应用的官方指南。",
  "firebase-app-hosting-basics": "使用 Firebase App Hosting 构建、部署与运维现代全栈 Web 应用（Next.js、Angular 等）。",
  "firebase-auth-basics": "Firebase Authentication 用户身份验证系统开发指南。配置主流第三方身份提供商、自定义声明及用户会话状态管理。",
  "firebase-basics": "Firebase CLI 基础环境配置、版本检测、CLI 安装、项目关联与跨环境身份验证指南。",
  "firebase-crashlytics": "Firebase Crashlytics 崩溃监控与性能异常诊断综合指南，通过命令行工具预配服务并快速定位崩溃堆栈。",
  "firebase-data-connect": "基于 PostgreSQL 与 GraphQL 构建、部署与管理 Firebase Data Connect (SQL Connect) 现代化数据后端。",
  "firebase-firestore": "Cloud Firestore NoSQL 数据库的搭建、管理、复杂查询、安全规则 (Security Rules) 及索引配置全流程指南。",
  "firebase-hosting-basics": "使用经典 Firebase Hosting 部署与托管静态网站、单页面应用 (SPA) 及微服务静态资源。",
  "firebase-remote-config-basics": "管理 Firebase Remote Config 远程配置模板、功能特性开关 (Feature Flags) 以及客户端动态加载策略与故障排查。",
  "firebase-security-rules-auditor": "全面审计 Firebase (Firestore、Cloud Storage) 安全规则，深度排查越权漏洞、鉴权旁路、逻辑缺陷与 DoS 风险。",
  "xcode-project-setup": "安全高效地修改 Xcode 工程文件 (.pbxproj)，为 iOS 开发添加 Swift Package 依赖并正确关联 Target 编译目标。",

  // 5. Dart & Flutter 生态
  "dart-add-unit-test": "使用 package:test 为 Dart 函数、方法和类编写清晰规范的单元测试套件与测试用例。",
  "dart-build-cli-app": "使用 Dart 构建健壮命令行应用程序的架构模式、入口结构设计、标准 I/O 处理与进程退出码规范。",
  "dart-collect-coverage": "使用 coverage 包收集 Dart 测试代码覆盖率并导出标准化 LCOV 质量分析报告。",
  "dart-fix-runtime-errors": "根据运行时的堆栈跟踪信息与 LSP 语言服务上下文，智能诊断并自动修复 Dart 运行时错误与异常。",
  "dart-generate-test-mocks": "使用 package:mockito 与 build_runner 自动生成外部依赖的 Mock 模拟对象，方便测试 API 与数据库交互。",
  "dart-migrate-to-checks-package": "将测试断言从传统的 package:matcher expect 语法平滑迁移至现代化 package:checks 断言风格。",
  "dart-resolve-package-conflicts": "排查并解决 Dart / Flutter 依赖版本冲突（pub get 版本求解器求解失败）的标准解决工作流。",
  "dart-run-static-analysis": "执行 dart analyze 运行静态代码分析并识别潜在风险，配合 dart fix --apply 自动修复已知代码异味与语法诊断问题。",
  "dart-setup-ffi-assets": "指导使用 Native Assets / Code Assets 将 C/C++ 源代码直接编译并打包到 Dart 原生动态链接库中。",
  "dart-use-ffigen": "指导使用 package:ffigen 根据 C/C++ 头文件全自动生成类型安全的 Dart FFI 外部函数接口绑定代码。",
  "dart-use-pattern-matching": "运用 Dart 3 模式匹配、switch 表达式与模式解构，精简复杂的控制流逻辑并提升代码类型安全性。",
  "dart-use-primary-constructors": "指导开发者编写符合 Dart 规范、简洁正确的 Primary 主构造函数与参数初始化列表。",
  "dart-write-documentation": "遵循 Effective Dart 官方标准编写规范优雅的 /// 三斜杠 API 接口文档注释。",
  "flutter-add-integration-test": "配置 Flutter Driver 驱动应用交互，并将端到端操作步骤自动化转换为 Flutter 集成测试用例。",
  "flutter-add-widget-preview": "利用 Flutter 预览系统为项目组件添加富交互式 Widget 预览视图与状态沙箱。",
  "flutter-add-widget-test": "使用 WidgetTester 构建组件级测试，严格验证 Widget 的渲染树、UI 外观及用户触摸手势交互。",
  "flutter-apply-architecture-best-practices": "遵循官方推荐的分层架构（UI 表现层、业务逻辑层、数据层）设计并重构可伸缩、高内聚的 Flutter 应用。",
  "flutter-build-responsive-layout": "使用 LayoutBuilder、MediaQuery 或 Expanded/Flexible 响应式布局组件构建自适应多端尺寸的优雅界面。",
  "flutter-fix-layout-issues": "诊断并排查 Flutter 常见布局错误（像素溢出 Overflow、无限约束 Unbounded、固有尺寸约束违规等）。",
  "flutter-implement-json-serialization": "使用 dart:convert 为数据模型类编写严谨规范的 fromJson 和 toJson 手工序列化与反序列化方法。",
  "flutter-setup-declarative-routing": "使用 go_router 等声明式路由框架配置 MaterialApp.router，支持深层链接、错误重定向与路由守卫。",
  "flutter-setup-localization": "配置 Flutter 国际化多语言支持：引入 flutter_localizations 与 intl，配置 l10n.yaml 并在组件树中集成 AppLocalizations。",
  "flutter-use-http-package": "使用 http 包规范发起 GET、POST、PUT、DELETE 网络请求，处理 HTTP 响应头、状态码与异常降级。",

  // 6. 生命科学、生物计算与医学文献数据库
  "alphafold-database-fetch-and-analyze": "检索并分析 AlphaFold 蛋白质三维预测结构模型。根据 UniProt Accession ID 分析结构置信度 (pLDDT)、结构域边界及无序区域。",
  "alphagenome-atlas-website-links": "构建 AlphaGenome Atlas 官方网站的深层链接：单变异位点探索视图、基因组区域展示、候选摘要表格及预测对比图表。",
  "alphagenome-single-variant-analysis": "使用 AlphaGenome API 深度分析遗传变异对基因表达 (RNA-seq)、染色质可及性 (DNASE)、组蛋白修饰 (ChIP) 及转录因子的生物学影响。",
  "alphagenome-variant-impact-score": "使用 AlphaGenome 变异影响评分 (AVI) 对遗传突变的功能影响进行定量评估、VCF 变异集注释及饱和突变扫描。",
  "chembl-database": "查询 ChEMBL 生物活性分子数据库，检索化合物结构、药物靶点、IC50/Ki 亲和力活性数据、已上市药物及作用机制。",
  "clinical-trials-database": "通过 APIv2 查询 ClinicalTrials.gov 全球临床试验数据库，根据疾病、药物、地点、状态或试验分期筛选试验详情与入组标准。",
  "clinvar-database": "检索人类基因组突变的临床意义、致病性分类（如致病 Pathogenic、良性 Benign、意义未明 VUS）及循证医学证据支撑。",
  "credentials": "安全管理 API 密钥与敏感凭据的交互规程：检测凭据完整性，并在缺失时通过安全流程引导用户输入。",
  "dbsnp-database": "在 NCBI dbSNP 数据库中检索短遗传突变位点 (SNP、Indel)，实现 rsID、VCF 染色体物理坐标与 HGVS 命名规范间的互转映射。",
  "embl-ebi-ols": "在 EMBL-EBI 本体查找服务 (OLS) 中检索生物医学本体术语（涵盖 GO、DOID、HP 等 250+ 词汇库），浏览层级树与详细定义。",
  "encode-ccres-database": "通过 SCREEN GraphQL API 查询 ENCODE 顺式调控元件 (cCREs)，或检索 ENCODE 门户的 ChIP-seq 峰图与原始实验数据。",
  "ensembl-database": "查询 Ensembl 数据库转换基因、转录本与蛋白质 ID，获取物理基因组序列、外显子结构及 VEP 变异后果预测。",
  "foldseek-structural-search": "使用 Foldseek API 对蛋白质物理 3D 坐标文件 (.cif / .pdb) 进行跨数据库（PDB、AlphaFold 等）的高速三维结构同源比对。",
  "gnomad-database": "查询 gnomAD 基因组聚合数据库，获取突变人群等位基因频率、群体罕见度及基因不耐受失活突变评估指标 (pLI、LOEUF)。",
  "gtex-database": "从 GTEx 数据库中检索人类 54 种正常组织样本的 RNA 定量表达数据与表达数量性状位点 (eQTL) 遗传调控信息。",
  "human-protein-atlas-database": "从人类蛋白质图谱 (HPA) 数据库检索蛋白质在人体各类器官与细胞亚结构中的半定量表达水平与空间定位信息。",
  "interpro-database": "在 InterPro 数据库中识别蛋白质的结构域、超家族与功能位点，探索蛋白质家族演化分布并借助深度学习进行功能注释。",
  "jaspar-database": "查询 JASPAR 转录因子结合基序数据库，获取位置频率矩阵 (PFM) 与权重矩阵 (PWM)，支持 MEME / TRANSFAC 格式输出。",
  "literature-search-arxiv": "在 arXiv 预印本平台上检索计算机、物理及交叉学科前沿学术论文，提取文献元数据、摘要并下载全文 PDF。",
  "literature-search-biorxiv": "检索、筛选并下载 bioRxiv 与 medRxiv 生命科学与医学领域的最新前沿预印本论文及补充材料。",
  "literature-search-europepmc": "在 Europe PMC 数据库中检索生命科学学术文献，批量下载开放获取 (OA) 全文 XML / 纯文本及引文元数据。",
  "literature-search-openalex": "查询 OpenAlex 全球开放学术知识图谱，检索数亿级论文成果、学者引用量、机构影响因子及文献 DOI 索引。",
  "ncbi-sequence-fetch": "使用 NCBI E-utilities 工具接口根据登录号、基因名称、PubMed ID 等精确检索并下载蛋白质与核酸 FASTA 序列。",
  "openfda-database": "查询与下载美国 FDA 官方开放数据：药品与医疗器械不良事件、召回信息、药品说明书、批准文号及 510(k) 认证许可。",
  "opentargets-database": "查询 Open Targets 药物靶点与疾病关联平台，评估靶点可成药性 (Tractability)、临床安全性及遗传学组学支撑证据。",
  "pdb-database": "在 RCSB PDB 数据库中检索与下载生物大分子（蛋白质、核酸、结合配体）的实验测定 3D 晶体/冷冻电镜结构与实验元数据。",
  "predictingthepast": "利用 Aeneas (拉丁文) 与 Ithaca (古希腊文) 深度模型进行古代受损残缺铭文文献的文本复原、归属分析、年代测定与地理定位。",
  "protein-sequence-msa": "使用 EBI Clustal Omega 对多条蛋白质序列执行多序列比对 (MSA)，评估进化保守性与关键活性功能位点残基。",
  "protein-sequence-similarity-search": "使用 MMseqs2 或 BLAST 算法对蛋白质序列进行高速同源性检索与比对，基于序列同源性推测未知蛋白生物学功能。",
  "pubchem-database": "查询 PubChem 官方化学分子数据库：依据化学名称、CID 编号或 SMILES 结构式检索分子理化性质、子结构相似度及生物活性。",
  "pubmed-database": "检索 PubMed 生物医学文献库与已发表临床试验，提取论文摘要与全文链接，打通基因、蛋白质与化合物数据库的关联知识。",
  "pymol": "使用 PyMOL 进行蛋白质及生物大分子 3D 结构的专业三维可视化渲染、空间叠合比对、关键残基相互作用分析及结构制图。",
  "quickgo-database": "查询 QuickGO 与 ECO 证据本体 REST API，映射基因与生物学过程、分子功能和细胞组分 (GO Terms) 之间的注释网络。",
  "reactome-database": "查询 Reactome 人类生物学反应与代谢信号通路数据库，执行基因列表通路富集分析并导出交互式生物分子网络图谱。",
  "string-database": "查询 STRING 蛋白质相互作用 (PPI) 数据库，检索已知与预测的蛋白互作网络、置信度得分及功能富集网络图。",
  "ucsc-conservation-and-tfbs": "从 UCSC Genome Browser 检索进化保守性打分 (phyloP、phastCons) 及转录因子结合位点 (TFBS) ENCODE 调控峰图注释。",
  "unibind-database": "查询 UniBind 数据库获取经实验严谨验证的转录因子结合位点 (TFBS) 数据集，下载染色体物理区间 BED 坐标及 FASTA 序列。",
  "uniprot-database": "查询 UniProt 蛋白质数据库：获取 UniProtKB、UniParc 与 UniRef 的蛋白质功能注释、分类学分类、序列信息与文献引用。",

  // 7. 自主智能体、工作流与架构设计
  "systematic-debugging": "系统化缺陷调试规范：在遇到任何 Bug、测试报错或非预期运行时行为时，在提出任何修改方案前必须首先进行系统性根因诊断。",
  "verification-before-completion": "成果交付严谨验证门禁：在宣称工作完成、代码修复或测试通过前，强制在终端运行真实测试验证命令，以实际执行结果作为事实依据。",
  "workflow-skill-creator": "工作流技能提炼生成器：将用户已完成的交互步骤或多阶段调试操作自动萃取提炼为可复用的独立智能体 Skill 规范定义。",
  "agy-customizations": "Antigravity 自定义扩展系统全景指南：详尽解析技能 (Skills)、规则 (Rules)、插件 (Plugins)、钩子 (Hooks) 与 MCP 服务的加载优先级、发现机制与开发规范。",
  "antigravity-guide": "Google Antigravity (AGY) 综合使用指南与全景索引：涵盖 Antigravity CLI (agy)、IDE 架构、Python SDK、斜杠命令、键位映射与定制系统参考。",
  "generative_ui": "生成式富 UI 交互组件规范：指导智能体在聊天窗口内或独立构件中实时渲染富有交互性的 HTML / Web 视图组件与动态图表。",
  "migrate-workflows": "自动化工作流平滑迁移工具：自动扫描并检索全局及工作区遗留的旧版 Workflow 流程，迁移转换为现代化规范的 SKILL.md 技能包。",
  "permissioned-github": "GitHub 安全授权操作规范：指导智能体遵循受限环境权限策略与 GitHub 安全交互，并在操作受限时向用户发起规范授权申请。"
};

// 检查并提取技能
const extractedFile = path.join(__dirname, 'extracted_skills.json');
let extractedSkills = [];

if (fs.existsSync(extractedFile)) {
  extractedSkills = JSON.parse(fs.readFileSync(extractedFile, 'utf8'));
} else {
  console.log('[SCAN] extracted_skills.json not found, scanning target directories...');
  const targetDirs = [
    path.join(process.env.USERPROFILE || 'C:\\Users\\myxge', '.gemini/config/plugins'),
    path.join(process.env.USERPROFILE || 'C:\\Users\\myxge', '.gemini/antigravity/builtin/skills')
  ];

  function findSkillFiles(dir) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    function traverse(current) {
      let entries;
      try { entries = fs.readdirSync(current, { withFileTypes: true }); } catch (e) { return; }
      for (const entry of entries) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) traverse(fullPath);
        else if (entry.isFile() && entry.name.toLowerCase() === 'skill.md') results.push(fullPath);
      }
    }
    traverse(dir);
    return results;
  }

  function parseFrontmatter(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!match) return null;
      const yaml = match[1];
      let name = null;
      let description = null;
      const nameMatch = yaml.match(/^name:\s*(.+)$/m);
      if (nameMatch) name = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const descMatch = yaml.match(/^description:\s*(?:([>|]-?)\r?\n)?([\s\S]*?)(?=\n[a-zA-Z0-9_-]+:|$)/m);
      if (descMatch) {
        if (descMatch[1]) {
          description = descMatch[2].split(/\r?\n/).map(l => l.replace(/^\s+/, '')).filter(Boolean).join(' ').trim();
        } else {
          description = descMatch[2].trim().replace(/^['"]|['"]$/g, '');
        }
      }
      return { filePath, name, description };
    } catch (e) {
      return null;
    }
  }

  for (const dir of targetDirs) {
    const files = findSkillFiles(dir);
    for (const f of files) {
      const meta = parseFrontmatter(f);
      if (meta && meta.description) extractedSkills.push(meta);
    }
  }
  fs.writeFileSync(extractedFile, JSON.stringify(extractedSkills, null, 2), 'utf8');
}

console.log(`Extracted skills count: ${extractedSkills.length}`);
console.log(`Configured translations count: ${Object.keys(TRANSLATIONS).length}`);

const missing = [];
for (const s of extractedSkills) {
  if (!TRANSLATIONS[s.name]) {
    missing.push(s.name);
  }
}

if (missing.length > 0) {
  console.error(`[ERROR] Missing translations for ${missing.length} skills:`, missing);
  process.exit(1);
} else {
  console.log('[SUCCESS] All 126 skills have translations configured!\n');
}

// 构建 skills.json 词典
const skillsDict = {};
let totalKeysAdded = 0;

function addEntry(k, v) {
  if (!k || !v) return;
  const key = k.trim();
  if (!key) return;
  if (!skillsDict[key]) {
    skillsDict[key] = v;
    totalKeysAdded++;
  }
}

for (const s of extractedSkills) {
  const zh = TRANSLATIONS[s.name];
  const origDesc = s.description;

  // 1. 原始 description
  addEntry(origDesc, zh);

  // 2. 规范化单行版本 (折叠多余空白为单空格)
  const normalizedDesc = origDesc.replace(/\s+/g, ' ').trim();
  addEntry(normalizedDesc, zh);

  // 3. 去掉前导 "- " 或 "* "
  const strippedPrefix = origDesc.replace(/^[-*]\s+/, '').trim();
  addEntry(strippedPrefix, zh);

  const strippedNormalized = normalizedDesc.replace(/^[-*]\s+/, '').trim();
  addEntry(strippedNormalized, zh);

  // 4. 如果包含首句，提取首句作为补充词条
  const firstSentenceMatch = strippedNormalized.match(/^([^.!?]+[.!?])/);
  if (firstSentenceMatch && firstSentenceMatch[1].length > 15 && firstSentenceMatch[1].length < strippedNormalized.length - 10) {
    // 很多 UI 在列表项可能只截取首句展示
    // 我们如果能对应首句，则也可以提供翻译
  }
}

const targetFile = path.join(__dirname, '../src/dictionary/skills.json');
fs.writeFileSync(targetFile, JSON.stringify(skillsDict, null, 2), 'utf8');
console.log(`[GENERATED] Saved ${totalKeysAdded} skill dictionary entries to src/dictionary/skills.json!`);
