// pages/thesaurus/thesaurus.js
Page({

    //定义页面变量
    myData: "123123",
    /**
     * 页面的初始数据
     */
    data: {
        receiveTimes: getApp().globalData.receiveTime,
        openId: "",
        word: "", //初始化单词
        msg: '此为词单首页',

        array: ["qwe", "Qweqweqe", "qweqfdgsgdd"]
    },
    getAllThesaurus: function () {
        wx.request({
            url: getApp().globalData.netServerAddrees + '/test',
            success: function (res) {

                console.log("请求jieguo " + res.data)
            }
        })
    },

    go2ReviewPage: function () {
        wx.navigateTo({
            url: '../thesaurus/thesaurusReview'+
            '/ThesaurusReviewPage?thesaurusName=2024/3/30/2/22/11',

        })
    },


    getAccessToken: function () {
        wx.request({
            url: getApp().globalData.netServerAddrees + '/getAccessToken1',
            method: "GET",
            success: function (res) {
                console.log("getAccessToken " + res)
                console.log(res)
                //   console.log(wx.getUserInfo())
            }
        })
    },
    sendMessage1: function () {
        wx.request({
            method: "GET",
            url: getApp().globalData.netServerAddrees + '/sendMessage',
            success: function (res) {
                console.log("getAccessToken " + res.data.access_token)
                console.log(res.data)
            }
        })
    },

    subscribleMessage: function () {
        console.log("订阅消息")
        wx.requestSubscribeMessage({
            tmplIds: ['tzl2jzIM73jZffYoX5iuLoFfjrgylnaSYOcXC6qfu2s'],
            success(res) {
                getApp().globalData.receiveTime = getApp().globalData.receiveTime + 1;
                console.log(res)
                console.log(getApp().globalData.receiveTime)
                wx.reLaunch()
                // console.log(this.data.receiveTimes)
            }
        })
    },


    getOpenId: function () {
        console.log("执行获取penid")
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: getApp().globalData.netServerAddrees + '/getOpenId',

                        //   url: 'http://103.97.128.236:8080/getOpenId',
                        data: {
                            code: res.code,
                        },
                        success: function (res) {
                            // word=res
                            // console.log("请求结果："+word)
                            console.log(res)

                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    vibrateLong: function () {
        wx.vibrateLong()
    },




    myTap: function (e) {
        console.log("点击了" + e)
        console.log(e)
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        console.log("yemian onload")

    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log("词单也出现了：")
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})