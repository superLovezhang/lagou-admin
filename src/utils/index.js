/**
 * Created by jiachenpan on 16/11/18.
 */
import Layout from '@/views/layout/Layout'

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function getRouter(tree, parent = null) {
  let routerList = []
  tree.map(item => {
    // 如果当前对象还有子元素 就继续递归并把结果放进当前元素的子元素中
    if (item.children.length !== 0) item.children = getRouter(item.children, item)
    // 如果当前元素类型为0或1 分别进行处理
    if (item.type === 0) routerList.push({
      path: item.url,
      redirect: `${item.url}/${item.children[0].path}`,
      component: Layout,
      meta: {
        title: item.name,
        icon: item.icon
      },
      children: item.children.length === 0 ? null : item.children
    })
    if (item.type === 1) {
      // 如果类型为1 并且为1级菜单
      if (item.pid === '0') {
        routerList.push({
          path: item.url,
          component: Layout,
          children: [{
            path: '',
            name: item.url.replace("/", ""),
            meta: {
              title: item.name,
              icon: item.icon
            },
            component: () => import('@/views/' + item.url.replace("/", "")),
            children: item.children.length === 0 ? null : item.children
          }]
        })
      } else {
        routerList.push({
          path: item.url,
          name: item.url,
          meta: {
            title: item.name
          },
          component: () => import(`@/views/${parent.url.replace("/", "")}/${item.url}`),
          children: item.children.length === 0 ? null : item.children
        })
      }
    }
  })
  return routerList
}