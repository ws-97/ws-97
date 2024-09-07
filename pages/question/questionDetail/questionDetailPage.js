// pages/question/qustionDetail/questionDetailPage.js

import {isFunction} from "../../component/common/validator";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        question: '',
        isReview: false,
        surveryAnserver: false,
        imgarr: [], //存放html中的资源图片,

        htmlSnip: '<div class="div_class"><h1>Title</h1> <p class="p">Life is&nbsp;<i>like</i>&nbsp;a box of<b>&nbsp;chocolates</b>.</p></div>',
        // timePickerConfig: {
        //     endDate: false,                          // 是否需要结束时间，为true时显示开始时间和结束时间两个picker
        //     column: "second",                       //可选的最小时间范围day、hour、minute、secend
        //     dateLimit: false,                        //是否现在时间可选范围，false时可选任意时间；当为数字n时，范围是当前时间的最近n天
        //     // initStartTime: '2019-01-01 12:32:44',    //picker初始时间，默认当前时间
        //     // initEndTime: "2019-12-01 12:32:44",     //picker初始结束时间，默认当前时间
        //     // limitStartTime: "2015-05-06 12:32:44",  //最小可选时间
        //     // limitEndTime: "2055-05-06 12:32:44"     //最大可选时间
        // },
        showSelectTimeBottomPopView: false,
    },

    /**
     * 完成选择时间 点击完成逻辑
     * @param e
     */
    setPickerTime(e) {

        console.log("收到时间确认：", e.detail.startTime)
        var that = this
        wx.showLoading()
        wx.request({
            url: getApp().globalData.netServerAddrees + "/addRemindTime?question=" + that.data.question + "&remindTime=" + e.detail.startTime,
            success: function (res) {
                console.log(res.data)

                if (that.data.surveryAnserver) { //当答案已经显示出来了
                    console.log("review页面退出")
                    wx.navigateBack({
                        success: res => {
                            // beforePage.onLoad();//周期函数或者函数名
                        }
                    })
                }
                //页面即将退出无需设置
                // that.setData({
                //     showSelectTimeBottomPopView: false
                // })
                wx.hideLoading()
            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }
        })
    },

    /**
     * 点击时间选择器上的取消按钮
     */
    hidePicker() {

        this.setData({
            showSelectTimeBottomPopView: false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        console.log("questionDetailpage onLoad 收到的数据为：", options)
        this.setData({
            question: options.question,
            // isReview: options.isReview.
        })
        wx.request({
            url: getApp().globalData.netServerAddrees +
                '/question/answer?' +
                'question=' + this.data.question,
            success: function (res) {
                console.log("响应数据：", res.data)
                // 主要代码
                let tempImgarr = [];
                let regex = new RegExp(/<img.*?(?:>|\/>)/gi); // 匹配所有图片
                let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配src图片
                let arrsImg = res.data.toString().match(regex); // obj.info 后台返回的富文本数据
                if (arrsImg != null && arrsImg.length > 0) {
                    for (let a = 0; a < arrsImg.length; a++) {
                        let srcs = arrsImg[a].match(srcReg);
                        tempImgarr.push(srcs[1])
                    }
                }
                that.setData({
                    imgarr: tempImgarr,
                    htmlSnip: res.data.toString()
                })
                // that.createSelectorQuery().select('#ep_editor').context(function (res) {
                // console.log("设置内容：",that.data.htmlSnip)
                // res.target.defaultContent=that.data.htmlSnip
                //   that.editorCtx = res.context
                //   that.editorCtx.setContents({
                //       html:that.data.htmlSnip    //这里就是设置默认值的地方（html 后面给什么就显示什么）
                //                           //注意是 this 赋值的 that，如果用 this 就把上面的 function 改成箭头函数
                //     });
                // }).exec()
                console.log("收到的html文本为,", that.data.htmlSnip.toString())
                wx.hideLoading()
            },
            error: function (e) {
                console.log("问题详情请求失败:" + e)
                wx.hideLoading()
            }
        })
        //
        // var that = this
        // wx.showLoading()
        // wx.request({
        //     url: getApp().globalData.netServerAddrees + "/question/getNextRemindTime?question="+that.data.question,
        //     success: function (res) {
        //         console.log(res.data)
        //         that.setData({
        //             timePickerConfig: {
        //                 endDate: false,                          // 是否需要结束时间，为true时显示开始时间和结束时间两个picker
        //                 column: "second",                       //可选的最小时间范围day、hour、minute、secend
        //                 dateLimit: false,                        //是否现在时间可选范围，false时可选任意时间；当为数字n时，范围是当前时间的最近n天
        //                 time_picker_title:res.data.toString(),  //时间选择器标题
        //                 // initStartTime: '2019-01-01 12:32:44',    //picker初始时间，默认当前时间
        //                 // initEndTime: "2019-12-01 12:32:44",     //picker初始结束时间，默认当前时间
        //                 // limitStartTime: "2015-05-06 12:32:44",  //最小可选时间
        //                 // limitEndTime: "2055-05-06 12:32:44"     //最大可选时间
        //             },
        //         })
        //         wx.hideLoading()
        //     },
        //     error: function (e) {
        //         console.log(e)
        //         wx.hideLoading()
        //     }
        // })
    },
    viewImage: function () {

        wx.previewImage({
            current: this.data.imgarr[0], // 当前显示图片的http链接
            urls: this.data.imgarr // 需要预览的图片http链接列表
        })
    },

    surveryAnswer: function () {
        console.log("查看答案")
        this.setData({
            surveryAnswer: true
        })
    },
    // 点击放大预览图片函数
    catchImage(e) {
        console.log(this.data.imgarr);
        wx.previewImage({
            current: this.data.imgarr[0], // 当前显示图片的http链接
            urls: this.data.imgarr // 需要预览的图片http链接列表
        })
    },

    /**
     * 点击  设置下一次提醒时间
     */
    setNextRemindTime: function () {

        //首先获取下一次提醒时间  然后显示时间选择器 时间选择器不能选取比当前时间之前的时间
        console.log("点击设置提醒时间")
        var that = this
        wx.showLoading()
        wx.request({
            url: getApp().globalData.netServerAddrees + "/question/getNextRemindTime?question=" + that.data.question,
            success: function (res) {
                console.log(res.data)
                var nextRemindTime = res.data.toString().trim();
                if (nextRemindTime.includes("[") || nextRemindTime.includes("]")) {
                    nextRemindTime = nextRemindTime.replace("[", "")
                    nextRemindTime = nextRemindTime.replace("]", "")
                }
                console.log("nextRemindTime", nextRemindTime)
                that.setData({
                    timePickerConfig: {
                        endDate: false,                          // 是否需要结束时间，为true时显示开始时间和结束时间两个picker
                        column: "second",                       //可选的最小时间范围day、hour、minute、secend
                        dateLimit: true,                        //是否现在时间可选范围，false时可选任意时间；当为数字n时，范围是当前时间的最近n天
                        time_picker_title: nextRemindTime,  //时间选择器标题
                        // initStartTime: formatTime(new Date()).str,    //picker初始时间，默认当前时间
                        // initEndTime: nextRemindTime,     //picker初始结束时间，默认当前时间
                        limitStartTime: formatTime(new Date()).str ,  //最小可选时间 2015-05-06 12:32:44"
                        limitEndTime: nextRemindTime     //最大可选时间
                    },
                    showSelectTimeBottomPopView: true
                })
                //页面即将退出无需设置
                // that.setData({
                //     showSelectTimeBottomPopView: false
                // })
                wx.hideLoading()
            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }
        })
    },

    timePickerConfirm: function (e) {

        console.log("确认时间：", e.detail)


    },

    // 保存到 存储 & 数据库
    remembered: function () {
        var that = this
        if (this.data.surveryAnserver) { //当答案已经显示出来了
            console.log("review页面退出")
            wx.navigateBack({
                success: res => {
                    // beforePage.onLoad();//周期函数或者函数名
                }
            })
        } else {
            console.log("增加复习周期")
            wx.request({
                url: getApp().globalData.netServerAddrees +
                    '/addRemindRecordServlet?thesaurusName=' + this.data.question +
                    '&type=1',
                success: function (res) {
                    console.log(res.data)
                    wx.navigateBack({
                        success: res => {
                            // beforePage.onLoad();//周期函数或者函数名
                        }
                        // console.log(getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusServlet')
                    })
                },
                error: function () {
                    wx.hideLoading()
                }

            })
        }

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

        console.log("questionDetailpage  onShow")
    },


    onReady() {
        console.log("questionDetailpage onReady")
    },


    onCreate() {
        console.log("questionDetailpage create")
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

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatTime(date) {

    if (typeof date == 'string' || 'number') {
        try {
            date = date.replace(/-/g, '/')//兼容ios
        } catch (error) {
        }
        date = new Date(date)
    }

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return {
        str: [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':'),
        arr: [year, month, day, hour, minute, second]
    }
}
