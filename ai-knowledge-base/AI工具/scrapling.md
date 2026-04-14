---

# Scrapling - 自适应Web Scraping框架

- **来源**：GitHub - D4Vinci/Scrapling
- **发布时间**：持续维护中
- **收录时间**：2026-04-14 00:59
- **Skill 链接**：https://clawhub.ai/D4Vinci/scrapling-official

## 核心能力

### 1. 自适应解析
网站结构变化后不用重写选择器，传 `adaptive=True` 自动重新定位元素，爬虫不怕网站改版。

### 2. 反爬绕过
内置 Cloudflare Turnstile 等反爬机制，开箱即用。

### 3. Spider 框架
支持并发爬取、暂停/恢复、自动代理轮换。

## 安装

```bash
pip install scrapling
```

## 基本用法

```python
from scrapling.fetchers import StealthyFetcher

# 绕过反爬抓取
p = StealthyFetcher.fetch('https://example.com', headless=True, network_idle=True)

# 自适应选择器
products = p.css('.product', auto_save=True)
products = p.css('.product', adaptive=True)  # 网站改版后仍能定位
```

## 高级爬虫

```python
from scrapling.spiders import Spider, Response

class MySpider(Spider):
    name = "demo"
    start_urls = ["https://example.com/"]

    async def parse(self, response: Response):
        for item in response.css('.product'):
            yield {"title": item.css('h2::text').get()}

MySpider().start()
```

## 关键词

#Web爬虫 #反爬 #自适应解析 #Python
