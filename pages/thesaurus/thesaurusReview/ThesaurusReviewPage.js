// pages/thesaurus/thesaurusReview/ThesaurusReviewPage.js
/**
 * 该页面负责显示单词表复习页面
 *
 * 接受的数据为thesaurusName
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        thesaurusName: "",
        list: [],

        // showList:[]
    },

    onHide: function (options) {
        console.log("页面隐藏")
        getApp().globalData.innerAudioContext.stop()
    },

    onLoad: function (options) {
        console.log("reviewer页面收到的数据为：")
        console.log(options)
        this.setData({
            thesaurusName: options.thesaurusName
            // thesaurusName: "2023/11/26"
        })
    },
    playAudio: function (e) {
        console.log("点击了播放",e.currentTarget.dataset.word,"当前播放的单词:",this.data.currentPlayWord)
        if (this.data.currentPlayWord === e.currentTarget.dataset.word) {
            console.log("暂停")
            getApp().globalData.innerAudioContext.stop()
        } else {
            this.data.currentPlayWord = e.currentTarget.dataset.word
            console.log("播放")
            console.log(this.data.innerAudioContext)
            getApp().globalData.innerAudioContext.src = 'http://dict.youdao.com/dictvoice?audio=' + e.currentTarget.dataset.word
            console.log(getApp().globalData.innerAudioContext.src)
            getApp().globalData.innerAudioContext.loop = true
            getApp().globalData.innerAudioContext.play() // 播放
        }
        //   innerAudioContext.pause() // 暂停

        //   innerAudioContext.stop() // 停止
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        wx.showLoading({
            title: 'loading',
        })
        var temp = wx.getStorageSync('receiveTime')
        wx.setStorageSync('receivTime', temp--);
        console.log(temp)

        var that = this
        console.log(getApp().globalData.netServerAddrees + '/queryThesaurus?thesaurusName=' + this.data.thesaurusName)

        wx.request({
            url: getApp().globalData.netServerAddrees + '/queryThesaurus?thesaurusName=' + this.data.thesaurusName,

            success: function (res) {
                console.log(res.data)
                var allList = new Array()
                for (var index in res.data) {
                    // title : res.data[index].title
                    var temp = false
                    // if (index == 0) {
                    //     temp = true
                    // }
                    allList.push({
                        word: res.data[index].cl_word,
                        phonetic: res.data[index].cl_phonetic,
                        mean: res.data[index].cl_mean,
                        eg: res.data[index].cl_eg,
                        showAnswer: temp
                    })
                }
                that.setData({ //setData在此位置
                    list: allList,
                })
                wx.hideLoading()

                // console.log(getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusServlet')
            },
            error: function (e) {
                wx.hideLoading()
            }

        })
    },

    showAnswer: function (e) {
        var tempList = []

        this.data.list.forEach(function (item, index) {
            console.log("变量:", item.word, e.currentTarget.dataset.text, (item.word.trim() === e.currentTarget.dataset.text.trim()));
            if (e.currentTarget.dataset.text.trim() == item.word.trim()) {
                item.showAnswer = true
                console.log("匹配成功", item)
            }
            tempList.push(item)
        })
        this.setData({
                list: tempList
            } //setData在此位置
        )



    },
    releaseWord:function (e){
        wx.showLoading()

        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees +
                '/deleteWordFromThesaurusServlet?thesaurusName=' + this.data.thesaurusName +
                "&word=" + e.currentTarget.dataset.word,
            success: function (res) {
                console.log("删除单词成功", e.currentTarget.dataset.word)
                var tempList = []
                that.data.list.forEach(function (item, index) {
                    console.log("变量:", item.word, e.currentTarget.dataset.word, (item.word.trim() === e.currentTarget.dataset.word.trim()));
                    if (e.currentTarget.dataset.word.trim() === item.word.trim()) {
                        console.log("匹配成功", item)
                    }else{
                        tempList.push(item)
                    }
                })
                that.setData({
                        list: tempList
                    } //setData在此位置
                )
                wx.hideLoading()
            },
            error: function (e) {
                wx.hideLoading()
            }
        })

    }
})