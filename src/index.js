const ORIGINS = {
  main: 'https://maoye-world.pages.dev',
  blog: 'https://blog-w.pages.dev',
  yanyun: 'https://maoye666.pages.dev',
  panel: 'https://maoye-panel-simulator.pages.dev'
}

export default {
  async fetch(request) {
    const incomingUrl = new URL(request.url)

    if (incomingUrl.hostname === 'www.maoye.world') {
      incomingUrl.hostname = 'maoye.world'
      return Response.redirect(incomingUrl.toString(), 301)
    }

    const redirect = normalizePath(incomingUrl)
    if (redirect) return redirect

    const origin = pickOrigin(incomingUrl.pathname)
    const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, origin)
    const originRequest = new Request(targetUrl, request)
    const response = await fetch(originRequest)

    return withGatewayHeaders(response)
  }
}

function normalizePath(url) {
  if (url.pathname === '/blog') {
    url.pathname = '/blog/'
    return Response.redirect(url.toString(), 301)
  }

  if (url.pathname === '/panel') {
    url.pathname = '/panel/'
    return Response.redirect(url.toString(), 301)
  }

  if (url.pathname === '/yanyun') {
    url.pathname = '/yanyun/'
    return Response.redirect(url.toString(), 301)
  }

  return null
}

function pickOrigin(pathname) {
  if (pathname === '/blog/' || pathname.startsWith('/blog/')) return ORIGINS.blog
  if (pathname === '/yanyun/' || pathname.startsWith('/yanyun/')) return ORIGINS.yanyun
  if (pathname === '/panel/' || pathname.startsWith('/panel/')) return ORIGINS.panel
  return ORIGINS.main
}

function withGatewayHeaders(response) {
  const headers = new Headers(response.headers)
  headers.set('X-Maoye-Router', 'maoye-router')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}
