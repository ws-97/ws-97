// pages/home.js
Page({

    selectJoinThesaurus: function (e) {

        console.log(e.detail.value)
        console.log(e.currentTarget.dataset)
        console.log(e.currentTarget.dataset.word_id)
        if(this.data.selectWordID.includes(e.currentTarget.dataset.word_id)){
            this.data.selectWordID.splice(this.data.selectWordID.indexOf(e.currentTarget.dataset.word_id),1)

        }else{
            this.data.selectWordID.push(e.currentTarget.dataset.word_id)
        }
        console.log(this.data.selectWordID)
        console.log(this.data.selectWordID.toString())

    }, /**
     * 页面的初始数据
     */
    data: {
        searchInputValue: "",
        searchResultList: [],
        hasCreateThesaurus: [],

        selectIndex: 0,

        selectWordID: [],

    },
    onShow: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + "/queryAllCreateThesaurus",
            success: function (res) {
                console.log(res.data)

                that.setData({
                    hasCreateThesaurus: res.data
                })
                wx.hideToast()
            },
            error: function (e) {
                console.log(e)
                wx.hideToast()
            }
        })
    },
    bindPickerChange: function (params) {
        console.log(params)
        this.setData({
            selectIndex: params.detail.value
        })

        wx.request({
            url: getApp().globalData.netServerAddrees + "/addWordListThesaurus",
            data: {
                thesaurusName: this.data.hasCreateThesaurus[this.data.selectIndex],
                wordIDList: this.data.selectWordID.toString()
            },
            success: function (res) {
                console.log(res.data)
                wx.hideToast()
            },
            error: function (e) {
                console.log(e)
                wx.hideToast()
            }
        })
    },

    bindKeyInput: function (e) {
        this.setData({
            searchInputValue: e.detail.value
        })


    },

    hasChinese: function (str) {
        const chinese = /[^\u4E00-\u9FA5]/g

        const number = /[^\d]/g;

        const englishAndNum = /[\W]/g

        if ((chinese.test(str))) {
            // wx.showToast({ title: "只允许输入中文", icon: "none" });
            return false;
        } else {
            return true;
        }
    },

    searchClick: function (params) {

        var that = this

        if (this.data.searchInputValue.toString().length === 0) {
            wx.showToast({
                title: '输入不为空',
                icon: 'error',
            })
            return;
        }
        if (that.hasChinese(this.data.searchInputValue)) {
            //搜索中文
            wx.request({
                url: getApp().globalData.netServerAddrees + '/getWordByMean',
                data: {
                    mean: this.data.searchInputValue
                },
                success: function (res) {
                    console.log(res.data)
                    that.setData({ //setData在此位置
                        searchResultList: res.data
                    })
                    wx.hideToast()
                },
                error: function (e) {
                    console.log(e)
                    wx.hideToast()
                }
            })
        } else {
            wx.request({
                url: getApp().globalData.netServerAddrees + '/queryWord',
                data: {
                    word: this.data.searchInputValue
                },
                success: function (res) {
                    console.log(res.data)
                    that.setData({ //setData在此位置
                        searchResultList: res.data
                    })
                    wx.hideToast()
                },
                error: function (e) {
                    console.log(e)
                    wx.hideToast()
                }
            })
        }

    },




})