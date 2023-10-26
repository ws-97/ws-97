// pages/thesaurus/thesaurusReview/ThesaurusReviewPage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
thesaurusName:""
    },


    onLoad:function(options){
        console.log("收到的数据为：")
        console.log(options)
                this.setData({
                    thesaurusName:options.thesaurusName
                })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        wx.showLoading({
          title: 'loading',
        })
      var temp=   wx.getStorageSync('receiveTime')
      wx.setStorageSync('receivTime', temp--);
      console.log(temp)

      var that = this
      console.log(getApp().globalData.netServerAddrees + '/ep/queryThesaurus?thesaurusName='+this.data.thesaurusName)

      wx.request({
          url: getApp().globalData.netServerAddrees + '/ep/queryThesaurus?thesaurusName='+this.data.thesaurusName,

          success: function (res) {
              console.log(res.data)
              var temList = new Array()
              for (var index in res.data) {
                  // title : res.data[index].title
                  temList.push({
                      word: res.data[index].cl_word,
                      phonetic: res.data[index].cl_phonetic,
                      mean: res.data[index].cl_mean,
                      eg: res.data[index].cl_eg,
                  })
              }

              that.setData({ //setData在此位置
                  list: temList, //这里把从后台获取到的数值赋给lists
              })
              wx.hideLoading()

              // console.log(getApp().globalData.netServerAddrees + '/ep/queryAllCreateThesaurusServlet')
          },
          error:function(e){
              wx.hideLoading()
          }

      })
    },
})