# 2024.03.27
* 限制一天内只检查一次404

# 2024.03.25
* 新增自动删除404

# 2024.03.06
* jquery写吐了，用vue重构页面，世界瞬间清净了，缺点是会多加载一个script
* 用 `$(document).on('ajaxSuccess', () =>{})` 拦截jquery ajax请求
* 增加BBS评论
* 增加自动删除n天前记录的功能
* 增加 github action 自动发布

# 2024.03.05
* 用 `unsafeWindow || window` 来保证可用
* 修复一些移动端样式问题
* 测试 `Edge/Chrome/Firefox` 和手机端 `Via` 浏览器均通过