import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const TARGET_HOST = "https://api.jdjygold.com";

serve(async (req) => {
  const url = new URL(req.url);
  // 构建目标地址（含路径和查询参数）
  const targetUrl = new URL(url.pathname + url.search, TARGET_HOST);
  
  // 复制并修正请求头
  const headers = new Headers(req.headers);
  headers.set("Host", TARGET_HOST.replace("https://", "")); // 移除协议前缀
  
  // 转发请求（显式处理请求体）
  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.body 
  });

  // 处理响应头（解决CORS问题）
  const proxyHeaders = new Headers(response.headers);
  proxyHeaders.set("access-control-allow-origin", "*");

  return new Response(response.body, {
    status: response.status,
    headers: proxyHeaders
  });
});