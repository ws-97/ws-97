// pages/thesaurus/thesaurusReview/ThesaurusReviewPage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        thesaurusName: "",
        showAnswer: [],
        // showList:[]
    },


    onLoad: function (options) {
        console.log("收到的数据为：")
        console.log(options)
        this.setData({
            thesaurusName: options.thesaurusName
            // thesaurusName: "2023/10/26/10/14/1"

        })
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
        console.log(getApp().globalData.netServerAddrees + '/ep/queryThesaurus?thesaurusName=' + this.data.thesaurusName)

        wx.request({
            url: getApp().globalData.netServerAddrees + '/ep/queryThesaurus?thesaurusName=' + this.data.thesaurusName,

            success: function (res) {
                console.log(res.data)
                var temList = new Array()
                var allList = new Array()

                for (var index in res.data) {
                    // title : res.data[index].title
                    allList.push({
                        word: res.data[index].cl_word,
                        phonetic: res.data[index].cl_phonetic,
                        mean: res.data[index].cl_mean,
                        eg: res.data[index].cl_eg,
                    }),
                    temList.push(
                        {
                            word: res.data[index].cl_word,
                        }
                    )
                }
                that.setData({ //setData在此位置
                    list:temList,
                    showAnswer:allList
                    // list: showAnswer, //这里把从后台获取到的数值赋给lists
                })
                wx.hideLoading()

                // console.log(getApp().globalData.netServerAddrees + '/ep/queryAllCreateThesaurusServlet')
            },
            error: function (e) {
                wx.hideLoading()
            }

        })
    },

    showAnswerAndRemove: function (e) {
        console.log(e.currentTarget.dataset.text)
        wx.request({
            url: getApp().globalData.netServerAddrees + 
            '/ep/deleteWordFromThesaurusServlet?thesaurusName=' + this.data.thesaurusName
            +"word="+e.currentTarget.dataset.text,
            success: function (res) {
                // this.data.list.pull()
                // that.setData({ //setData在此位置
                //     list:temList,
                //     showAnswer:allList
                // })
                wx.hideLoading()
            },
            error: function (e) {
                wx.hideLoading()
            }
        })
        // this.setData({
        //     showAnswer.push(e.currentTarget.dataset.text)
        // })
        // this.data.showAnswer.push(e.currentTarget.dataset.text)
        // var temp=this.data.showAnswer;
    //  temp.push(e.currentTarget.dataset.text)
    // console.log(this.data.list)
    // console.log(this.data.list.indexOf(e.currentTarget.dataset.text))
    // this.data.showAnswer.forEach(element => {
    //     if(element.word==e.currentTarget.dataset.text){zz}
    // });
    //    console.log(this.data.showAnswer[this.data.list.indexOf(e.currentTarget.dataset.text)])

    }
})