let timeout = null

// 防抖函数
const debounce = (fn, wait) => {
  if (timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(fn, wait)
}

export default debounce
