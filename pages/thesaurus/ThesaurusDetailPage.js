// pages/thesaurus/detail/ThesaurusDetailPage.js
Page(

    
    {

    /**
     * 页面的初始数据
     */
    data: {
        //     innerAudioContext: wx.createInnerAudioContext({
        //     useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        // }),
        thesaurusName: "",
        list: [],
        option: ['全部显示', '英译汉', '汉译英', '全部记住了'],
        currentPlayWord: ""
    },

    onLoad: function (options) {
        console.log("收到的数据为：")
        console.log(options)
        this.setData({
            thesaurusName: options.thesaurusName,
            currentTab: 0,
        })
    },
    changeNavBar: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.tab_index
        })
        if (this.data.currentTab == 3) {
            wx.request({
                url: getApp().globalData.netServerAddrees + '/ep/addRemindRecordServlet?thesaurusName=' + this.data.thesaurusName,
                success: function (res) {
                    console.log(res.data)
                    wx.navigateBack({
                        success: res => {
                            // beforePage.onLoad();//周期函数或者函数名
                        }
                        // console.log(getApp().globalData.netServerAddrees + '/ep/queryAllCreateThesaurusServlet')
                    })
                },
                error: function () {
                    wx.hideLoading()
                }

            })


        } else {

        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 开始加载数据
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/ep/queryThesaurus?thesaurusName=' + this.data.thesaurusName,
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
            error: function () {
                wx.hideLoading()
            }

        })
    },

    playAudio: function (e) {
        console.log("点击了播放")
        console.log(e.currentTarget.dataset.word)
       const innerAudioContext= wx.createInnerAudioContext({
            useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        })
        // if (this.data.currentPlayWord == e.currentTarget.dataset.word) {
        //     console.log("暂停")
        //     innerAudioContext.stop()
        // } else {
            this.data.currentPlayWord=e.currentTarget.dataset.word
            console.log("播放")
            innerAudioContext.src = 'http://dict.youdao.com/dictvoice?audio=' + e.currentTarget.dataset.word
            // innerAudioContext.loop = true
            innerAudioContext.play() // 播放
        // }
        //   innerAudioContext.pause() // 暂停

        //   innerAudioContext.stop() // 停止
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