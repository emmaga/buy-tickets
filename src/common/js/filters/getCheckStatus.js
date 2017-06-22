function getCheckStatus (value) {
  switch (value) {
    case 'checked':
      return '已检票'
    case 'checking':
      return '检票中'
    case 'waiting':
      return '待检票'
    case 'refund':
      return '已退票'
  }
}

export default getCheckStatus
