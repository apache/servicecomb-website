$(".wy-side-nav-search").append('<div role="search"> \
<form id ="rtd-search-form" class="wy-form" action="https://cn.bing.com"> \
<input type="text" name="q" placeholder="搜索..." value=""/> \
<input type="hidden" name="q1" value="site:' + window.location.host + '"/> \
  </form></div>')