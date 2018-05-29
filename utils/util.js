const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const createNonceStr = n => {
  return Math.random().toString(36).substr(2, 15)
}

const createTimeStamp = n => {
  return parseInt(new Date().getTime() / 1000) + ''
}

const noTransaction = opt => {
  wx.showToast({
    title: opt.title,
    icon: 'success',
    mask: true,
    image: '../../images/icon_error.png',
    duration: 2000,
    success: function () {
      setTimeout(function () {
        wx.navigateBack({ changed: true });
      }, 2000) //延迟时间
    }
  });
}

const errorModal = opt => {
  wx.showToast({
    title: opt.title,
    icon: 'success',
    mask: true,
    image: '../../images/icon_error.png',
    duration: 2000,
    success: function () {
    }
  });
}

const warningModal = opt => {
  wx.showToast({
    title: '输入不能为空',
    icon: 'success',
    mask: true,
    image: '../../images/icon_error.png',
    duration: 2000,
    success: function () {
    }
  });
}

module.exports = {
  formatTime: formatTime,
  createNonceStr: createNonceStr,
  createTimeStamp: createTimeStamp,
  noTransaction: noTransaction,
  warningModal: warningModal,
  errorModal: errorModal
}