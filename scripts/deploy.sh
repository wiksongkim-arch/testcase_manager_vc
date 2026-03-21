#!/bin/bash
set -e

# 日志设置
LOG_DIR="$(cd "$(dirname "$0")/.." && pwd)/logs"
mkdir -p "$LOG_DIR"
LOG_DATE=$(date '+%Y-%m-%d')
LOG_FILE="$LOG_DIR/deploy_${LOG_DATE}.log"

# 日志函数
log() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$message" | tee -a "$LOG_FILE"
}

log_error() {
    log "[ERROR] $1" >&2
}

log_info() {
    log "[INFO] $1"
}

log_success() {
    log "[SUCCESS] $1"
}

log_warn() {
    log "[WARN] $1"
}

# 记录脚本开始
log "========================================"
log_info "开始执行部署脚本"
log_info "脚本参数: $*"
log_info "当前目录: $(pwd)"
log "========================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  TestCase Manager 部署脚本${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    log_error "Docker 未安装"
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
    exit 1
fi
log_info "Docker 已安装: $(docker --version)"

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "Docker Compose 未安装"
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    echo "请访问 https://docs.docker.com/compose/install/ 安装 Docker Compose"
    exit 1
fi
log_info "Docker Compose 已安装"

# 确定 compose 命令
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi
log_info "使用 compose 命令: $COMPOSE_CMD"

# 解析参数
ENV=${1:-dev}
PULL=false

# 解析其他参数
for arg in "$@"; do
    case $arg in
        --pull)
            PULL=true
            log_info "启用 --pull 选项"
            ;;
        -h|--help)
            echo "用法: $0 [dev|prod] [--pull]"
            echo ""
            echo "选项:"
            echo "  dev       使用开发环境配置 (默认)"
            echo "  prod      使用生产环境配置"
            echo "  --pull    部署前拉取最新代码"
            echo "  -h, --help 显示此帮助信息"
            exit 0
            ;;
    esac
done

if [ "$ENV" = "prod" ]; then
    log_info "使用生产环境配置"
    echo -e "${BLUE}使用生产环境配置${NC}"
    COMPOSE_FILE="docker-compose.prod.yml"
    
    # 检查环境变量文件
    if [ ! -f .env ]; then
        log_warn ".env 文件不存在"
        echo -e "${YELLOW}警告: .env 文件不存在${NC}"
        echo "请复制 .env.example 到 .env 并修改配置:"
        echo "  cp .env.example .env"
        echo ""
        read -p "是否继续使用默认配置? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_error "用户取消部署"
            exit 1
        fi
        log_info "用户选择继续使用默认配置"
    fi
else
    log_info "使用开发环境配置"
    echo -e "${BLUE}使用开发环境配置${NC}"
    COMPOSE_FILE="docker-compose.yml"
fi

# 拉取最新代码
if [ "$PULL" = true ]; then
    log_info "拉取最新代码..."
    echo -e "${BLUE}拉取最新代码...${NC}"
    if ! git pull origin main; then
        log_warn "拉取代码失败，继续使用本地代码"
        echo -e "${YELLOW}警告: 拉取代码失败，继续使用本地代码${NC}"
    else
        log_success "代码拉取成功"
    fi
fi

# 构建镜像
log_info "构建 Docker 镜像..."
echo -e "${BLUE}构建 Docker 镜像...${NC}"
if $COMPOSE_CMD -f $COMPOSE_FILE build 2>&1 | tee -a "$LOG_FILE"; then
    log_success "Docker 镜像构建成功"
else
    log_error "Docker 镜像构建失败"
    exit 1
fi

# 启动服务
log_info "启动服务..."
echo -e "${BLUE}启动服务...${NC}"
if $COMPOSE_CMD -f $COMPOSE_FILE up -d 2>&1 | tee -a "$LOG_FILE"; then
    log_success "服务启动成功"
else
    log_error "服务启动失败"
    exit 1
fi

# 等待服务启动
log_info "等待服务启动..."
echo -e "${BLUE}等待服务启动...${NC}"
sleep 5

# 检查服务状态
log_info "检查服务状态..."
echo ""
echo -e "${GREEN}服务状态:${NC}"
$COMPOSE_CMD -f $COMPOSE_FILE ps | tee -a "$LOG_FILE"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  部署完成!${NC}"
echo -e "${GREEN}================================${NC}"

if [ "$ENV" = "prod" ]; then
    log_success "生产环境部署完成"
    echo -e "访问地址: http://localhost (或配置的域名)"
else
    log_success "开发环境部署完成"
    echo -e "Web 前端: ${BLUE}http://localhost:3000${NC}"
    echo -e "API 服务: ${BLUE}http://localhost:3001${NC}"
fi

echo ""
echo "常用命令:"
echo "  查看日志: $COMPOSE_CMD -f $COMPOSE_FILE logs -f"
echo "  停止服务: $COMPOSE_CMD -f $COMPOSE_FILE down"
echo "  重启服务: $COMPOSE_CMD -f $COMPOSE_FILE restart"
echo ""
echo "部署日志保存在: $LOG_FILE"

log_info "部署脚本执行完成"
log "========================================"
