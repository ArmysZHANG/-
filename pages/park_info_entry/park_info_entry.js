var checkNetWork = require('../../utils/check_network.js');
var utils = require('../../utils/util.js');

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyboard1:
    '新京津沪冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝           ',//首页键盘,显示省的简称,空格保留前端渲染空白框
    keyboardNumber: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890     ',//空格保留前端渲染空白框
    keyboardAlph: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ               ',//空格保留前端渲染空白框
    keyboardValue: '',
    textArr: [],//存储输入值
    textArrShow: [],//前端显示的值
    textValue: '',
    keyboard2For: true,//提交按钮置灰
    keyboard2: '',
    tapNum: true, //数字键盘是否可以点击
    specialBtn: false,//数字键盘是否可以点击
    sercherStorage: [] //搜索记录

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let searchData = wx.getStorageSync("searchData");
    this.setData({
      sercherStorage: searchData || []
    })
    wx.showNavigationBarLoading();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideNavigationBarLoading()
    var self = this;
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    self.data.keyboard1 = self.data.keyboard1.split('');

    self.setData({
      keyboardValue: self.data.keyboard1
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  paybill: function () {
    var self = this;
    if (!checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误');
    } else {
      //将搜索记录更新到缓存
      let searchData = self.data.sercherStorage;
      // 如果搜索记录里面有重复的，要做删除操作
      for (let i = 0; i < searchData.length; i++) {
        if (searchData[i] == self.data.textValue) {
          searchData.splice(i, 1);
          break;
        }
      }
      // 如果超过3条搜索记录的话，删掉最旧的一条
      if (searchData.length >= 3) searchData.pop();
      // 添加搜索记录
      searchData.unshift(self.data.textValue)
      wx.setStorageSync('searchData', searchData);
      self.setData({
        sercherStorage: searchData
      })

      //跳转页面
      wx.navigateTo({
        url: '../xxxx?plateNo=' + self.data.textValue,
      })
    }
  },
  /**
   * 键盘事件
   */
  tapKeyboard: function (e) {
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    //判断为空不做任何操作
    if (tapVal === " " || tapVal === undefined) {
      return
    }
    if (tapVal == '巛') {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = self.data.keyboard1;
      } else if (self.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        this.keyboardValue = self.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = self.data.keyboard2;
      }
      if (self.data.textArr.length <= 6) {
        self.setData({
          keyboard2For: true
        });
      }
      self.data.textValue = self.data.textArr.join('');
      self.setData({
        textValue: self.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum,
        textArrShow: self.data.textArr
      });
      return false;
    }
    var textLength = self.data.textArr.length;
    if (textLength >= 6) {
      self.setData({
        keyboard2For: false
      });
    }
    if (textLength > 7) {
      utils.errorModal({ "title": "车牌号超长" })
      return false;
    }
    self.data.textArr.push(tapVal);
    self.data.textValue = self.data.textArr.join('');
    self.setData({
      textValue: self.data.textValue,
      keyboardValue: self.data.keyboard2,
      specialBtn: true,
      textArrShow: self.data.textArr
    });
    if (self.data.textArr.length > 1) {
      //展示数字键盘
      self.setData({
        tapNum: true
      });
    }
  },
  /**
   * 点击缓存搜索列表
   */
  tapSercherStorage: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.id;

    let sercherStorage = that.data.sercherStorage;
    let chooseItem = sercherStorage.splice(index, 1);

    that.setData({
      textValue: chooseItem[0]
    })
    if (that.data.textValue != '') {
      sercherStorage.unshift(chooseItem[0]);
      that.setData({
        sercherStorage: sercherStorage,
        textArr: that.data.textValue.split(''),
        textArrShow: that.data.textValue.split(''),
        keyboard2For: false,
        specialBtn: true,
        tapNum: true
      })
      wx.setStorageSync('searchData', sercherStorage);
    } else {
      utils.warningModal();
    }
  }
})