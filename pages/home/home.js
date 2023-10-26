// pages/home/home.js
Page({
 
  
    /**
     * 页面的初始数据
     */
    data: {
     
        navbar: ['创建词单', '已创建', '进行中', '已完成'],
        currentTab: 1,
        thesauruslist: [],
        createThesaurusName: new Date().toLocaleDateString()+"/"+new Date().getHours()+"/"+new Date().getMinutes()+"/"+new Date().getSeconds(),
        capacity: 10,
        // nowTime:new Date().toLocaleDateString()+"/"+new Date().getHours()+"/"+new Date().getMinutes()+"/"+new Date().getSeconds()
    },
    onShow: function () {



        wx.showLoading({
            title: '加载中',
          })
        this.startLoop()
        this.getHasCreateThesaurus();
        wx.setNavigationBarTitle({
            title: '小助手' + wx.getStorageSync('receiveTime')
        })
        // wx.hideLoading()
    },
    getThesaurusCapacityValue(e) {
        console.log(e.detail.value) // {value: "ff", cursor: 2}  
        this.data.capacity = e.detail.value
    },
    getThesaurusNameValue(e) {
        console.log(e.detail) // {value: "ff", cursor: 2}  
        this.data.createThesaurusName = e.detail.value
    },

    createThesaurus: function (e) {
        e.currentTarget.dataset.tab_index
        wx.request({
            url: getApp().globalData.netServerAddrees + '/ep/createThesaurus?thesaurusName=' +
                this.data.createThesaurusName + '&thesaurusCapacity=' + this.data.capacity,
            success: function (res) {
                console.log(res)
                wx.hideLoading()
            },
            error:function(e){
                console.log(e)
                wx.hideLoading()
            }
        })
    },
    startLoop: function () {
        wx.request({
            url: getApp().globalData.netServerAddrees + '/ep/getInProgressThesaurusAndStartLooper',
            success: function (res) {
                console.log("请求所有未完成的数据：")
                console.log(res)
                // wx.hideLoading()

            },
            error:function(e){
                console.log(e)
                // wx.hideLoading()
            }
        })
    },

    // 改变顶部导航
    changeNavBar: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.tab_index
        })
        wx.showLoading({
            title: '加载中',
          })
        // e.currentTarget.dataset.tab_name..color="#0000ff"
        this.subscribleMessage()
        if (this.data.currentTab == 0) {
            this.setData({
                createThesaurusName:new Date().toLocaleDateString()+"/"+new Date().getHours()+"/"+new Date().getMinutes()+"/"+new Date().getSeconds()
            })

        wx.hideLoading()
        } else if (this.data.currentTab == 1) {
            this.getHasCreateThesaurus()
            console.log("执行获取已创词单")

        } else if (this.data.currentTab == 2) {
            this.getInProgressThesaurus()

        } else {
            this.getHasFinshedThesaurus()

        }
        // wx.hideLoading()
    },

    getHasFinshedThesaurus:function(){
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/ep/getFinishedThesaurus',
            success: function (res) {
                console.log(res.data)
                var temList = new Array()
                for (var index in res.data) {
                    // title : res.data[index].title
                    temList.push({
                        title: res.data[index].cl_thesaurusName,
                    })
                }
                that.setData({ //setData在此位置
                    thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                })
                wx.hideLoading()
               // console.log(getApp().globalData.netServerAddrees + '/ep/queryAllCreateThesaurusServlet')
            },
            error:function(e){
                console.log(e)
                wx.hideLoading()
            }
        })
    },
    subscribleMessage: function () {
        console.log("订阅消息")
        wx.requestSubscribeMessage({
            tmplIds: ['tzl2jzIM73jZffYoX5iuLoFfjrgylnaSYOcXC6qfu2s'],
            success(res) {
                console.log(res)
                try {
                    var value = wx.getStorageSync('receiveTime')
                    if (value) {
                        // Do something with return value
                        wx.setStorageSync('receiveTime', parseInt(value) + 1)
                    } else {
                        wx.setStorageSync('receiveTime', 1)
                    }
                } catch (e) {
                    // Do something when catch error
                    wx.setStorageSync('receiveTime', 1)
                } finally {
                    console.log(value)
                }

                // console.log(this.data.receiveTimes)
            }
        })
    },

    goThesaurusDetailPage: function (e) {
        console.log(e.currentTarget.dataset.text)
        console.log(e.target.dataset.text)
        if(this.data.currentTab!=2){
                    wx.navigateTo({
            //   url: 'pages/thesaurus/detail/ThesaurusDetailPage',
            url: '../thesaurus/ThesaurusDetailPage?thesaurusName=' + e.target.dataset.text,
            fail: function (res) {
                console.log(res)
            },
            success: function (res) {
                console.log(res)
            }
        })
        }else{
            wx.showToast({
                title: '正在提醒计划中',  // 标题
                icon: 'error',   // 图标类型，默认success
                duration: 1500   // 提示窗停留时间，默认1500ms
            })
        }

    },

    getHasCreateThesaurus: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/ep/queryAllCreateThesaurusServlet',
            success: function (res) {
                console.log(res.data)
                var temList = new Array()
                for (var index in res.data) {
                    // title : res.data[index].title
                    temList.push({
                        title: res.data[index],
                    })
                }

                that.setData({ //setData在此位置
                    thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                })
                wx.hideLoading()
                // console.log(getApp().globalData.netServerAddrees + '/ep/queryAllCreateThesaurusServlet')
            },
            error:function(e){
                console.log(e)
                wx.hideLoading()
            }

        })
    },
    getInProgressThesaurus: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/ep/getInProgressThesaurusServlet',
            success: function (res) {
                console.log(  res.data)
                var temList = new Array()
                for (var index in res.data) {
                    // title : res.data[index].title
                    console.log(res.data[index])
                    console.log("定位点：1")
                    console.log( res.data[index].cl_remind_time)
                    console.log("定位点：2")
                    console.log( res.data[index].cl_next_remind_point_index)
                    console.log("定位点：")
                    console.log(res.data[index].cl_remind_time.split(',')[res.data[index].cl_next_remind_point_index])
                    temList.push({
                        title: "词单名: "+ res.data[index].cl_thesaurusName,
                        nextRemindTime:"下一次提醒点: "+res.data[index].cl_remind_time.split(',')[res.data[index].cl_next_remind_point_index]
                    })
                }

                that.setData({ //setData在此位置
                    thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                })
                wx.hideLoading()
                // console.log(getApp().globalData.netServerAddrees + '/ep/queryAllCreateThesaurusServlet')
            },
            error:function(e){
                console.log(e)
                wx.hideLoading()
            }

        })
    }
})