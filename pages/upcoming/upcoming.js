// pages/home/home.js
Page({


    /**
     * 页面的初始数据
     */
    data: {

        navbar: ['创建词单', '创建备忘录', '已创建', '进行中', '已完成'],
        currentTab: 2,
        thesauruslist: [],
        createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds(),
        capacity: 10,
        // nowTime:new Date().toLocaleDateString()+"/"+new Date().getHours()+"/"+new Date().getMinutes()+"/"+new Date().getSeconds()


        //创建备忘录页所需变量开始
        imgOneSwitch: true,
        imgOne: [],
        MAXCOUNTIMAGE: 9,
        //创建备忘录页所需变量 结束
    },
    onShow: function () {

        if (this.data.currentTab === 2) { //进入默认页面
            wx.showLoading({
                title: '加载中',
            })
            this.startLoop()
            this.getHasCreateThesaurus();
        }

        wx.setNavigationBarTitle({
            title: '小助手' + wx.getStorageSync('receiveTime')
        })
        console.log("页面初始化tab索引：")
        console.log(this.data.currentTab)
        // wx.hideLoading()
    },
    getThesaurusCapacityValue(e) {
        console.log(e.toLocaleString())
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
            url: getApp().globalData.netServerAddrees + '/createThesaurus?thesaurusName=' +
                this.data.createThesaurusName + '&thesaurusCapacity=' + this.data.capacity,
            success: function (res) {
                console.log(res)
                wx.hideLoading()
            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }
        })
    },
    startLoop: function () {
        wx.request({
            url: getApp().globalData.netServerAddrees + '/getInProgressThesaurusAndStartLooper',
            success: function (res) {
                console.log("请求所有未完成的数据：")
                console.log(res)
                // wx.hideLoading()

            },
            error: function (e) {
                console.log(e)
                // wx.hideLoading()
            }
        })
    },

    // 改变顶部导航
    changeNavBar: function (e) {
        this.setData({
            currentTab: e.currentTarget.dataset.tab_index,
            capacity: 10
        })
        wx.showLoading({
            title: '加载中',
        })
        // e.currentTarget.dataset.tab_name..color="#0000ff"
        this.subscribleMessage()
        if (this.data.currentTab == 0) {
            this.setData({
                createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds()
            })
            wx.hideLoading()
        } else if (this.data.currentTab == 1) {
            this.setData({
                createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds()
            })
            console.log("执行获取已创词单")
            wx.hideLoading()

        } else if (this.data.currentTab == 2) {
            this.getHasCreateThesaurus()
            console.log("执行获取已创词单")

        } else if (this.data.currentTab == 3) {
            this.getInProgressThesaurus()

        } else {
            this.getHasFinshedThesaurus()

        }
        // wx.hideLoading()
    },

    getHasFinshedThesaurus: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/getFinishedThesaurus',
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
            },
            error: function (e) {
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
        if (this.data.currentTab != 3) {
            if (this.data.currentTab == 4) {
                wx.navigateTo({
                    //   url: 'pages/thesaurus/detail/ThesaurusDetailPage',
                    url: '../thesaurus/thesaurusReview/ThesaurusReviewPage?thesaurusName=' + e.target.dataset.text.title,
                    fail: function (res) {
                        console.log(res)
                    },
                    success: function (res) {
                        console.log(res)
                    }
                })
            } else {
                if (e.target.dataset.text.isMemorandum) {
                    wx.navigateTo({
                        //   url: 'pages/thesaurus/detail/ThesaurusDetailPage',
                        url: '../memorandum/memorandumpage?memorandumName=' + e.target.dataset.text.title,
                        fail: function (res) {
                            console.log(res)
                        },
                        success: function (res) {
                            console.log(res)
                        }
                    })
                } else {
                    wx.navigateTo({
                        //   url: 'pages/thesaurus/detail/ThesaurusDetailPage',
                        url: '../thesaurus/ThesaurusDetailPage?thesaurusName=' + e.target.dataset.text.title,
                        fail: function (res) {
                            console.log(res)
                        },
                        success: function (res) {
                            console.log(res)
                        }
                    })
                }

            }

        } else {
            wx.showToast({
                title: '正在提醒计划中', // 标题
                icon: 'error', // 图标类型，默认success
                duration: 1500 // 提示窗停留时间，默认1500ms
            })
        }

    },

    getHasCreateThesaurus: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusServlet',
            success: function (res) {
                console.log(res.data)
                var temList = new Array()
                for (var index in res.data) {
                    // title : res.data[index].title
                    temList.push({
                        title: res.data[index],
                        isMemorandum: false
                    })
                }
                wx.request({
                    url: getApp().globalData.netServerAddrees + '/queryAllCreateMemorandum',
                    success: function (res) {
                        console.log(res.data)
                        // var temList = new Array()
                        for (var index in res.data) {
                            // title : res.data[index].title
                            temList.push({
                                title: res.data[index],
                                isMemorandum: true
                            })
                        }

                        // this.getHasCreateMemorandum(temList);

                        that.setData({ //setData在此位置
                            thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                        })
                        wx.hideLoading()
                        // console.log(getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusServlet')
                    },
                    error: function (e) {
                        console.log(e)
                        wx.hideLoading()
                    }
                })

                that.setData({ //setData在此位置
                    thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                })
                wx.hideLoading()
                // console.log(getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusServlet')
            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }
        })
    },

    getHasCreateMemorandum: function (temp) {

        console.log("getHasCreateMemorandum")

    },


    getInProgressThesaurus: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/getInProgressThesaurusServlet',
            success: function (res) {
                console.log(res.data)
                var temList = new Array()
                for (var index in res.data) {
                    // title : res.data[index].title
                    console.log(res.data[index])
                    console.log("定位点：1")
                    console.log(res.data[index].cl_remind_time)
                    console.log("定位点：2")
                    console.log(res.data[index].cl_next_remind_point_index)
                    console.log("定位点：")
                    console.log(res.data[index].cl_remind_time.split(',')[res.data[index].cl_next_remind_point_index])
                    temList.push({
                        title: "词单名: " + res.data[index].cl_thesaurusName,
                        nextRemindTime: "下一次提醒点: " + res.data[index].cl_remind_time.split(',')[res.data[index].cl_next_remind_point_index]
                    })
                }

                that.setData({ //setData在此位置
                    thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                })
                wx.hideLoading()
                // console.log(getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusServlet')
            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }

        })
    },


    // 保存到 存储 & 数据库
    onCreatMorandum: function () {

        if (this.data.imgOne.length == 0) {
            wx.showToast({
                title: '请添加图片',
                icon: 'none'
            })
            return
        }

        console.log('通过 ---空--- 校验')

        wx.showToast({
            title: '上传图片中',
            icon: 'loading',
            duration: 30000,
            mask: true
        })

        let promiseArr = []
        let imgLength = this.data.imgOne.length;
        // 图片上传
        for (let i = 0; i < imgLength; i++) {
            promiseArr.push(wx.getFileSystemManager().readFileSync(this.data.imgOne[i], 'base64'));
        }
        console.log(promiseArr)
        wx.request({
            url: getApp().globalData.netServerAddrees + '/createMemorandumByString',
            // header:{'content-type':'multipart/form-data;boundary=1634796333288'},
            header: {'content-type': 'application/x-www-form-urlencoded'},

            method: "POST",
            data: {
                memorandumName: this.data.createThesaurusName.toString(),
                "description": '...',
                "imageFiles": promiseArr
            },
            success: function (res) {
                console.log(res.data)
                wx.hideLoading()
            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }
        })
    },


    addtoDB: function (fileIds) {
        wx.showToast({
            title: '发布中...',
        })
    },

    // 选择图片 + 回显 
    onChooseOne: function () {
        let that = this
        wx.chooseImage({
            count: this.data.MAXCOUNTIMAGE - this.data.imgOne.length,
            // sizeType: ['compressed','original'],
            sourceType: ['album', 'camera'],
            sizeType: ['compressed'],
            // sourceType: ['album'],
            success(res) {
                console.log(res)
                let tempArr = that.data.imgOne.concat(res.tempFilePaths)
                that.setData({
                    'imgOne': tempArr
                })
                console.log("选取图片结果：")
                console.log(that.data.imgOne)
                if (that.data.imgOne.length >= that.data.MAXCOUNTIMAGE) {
                    that.setData({
                        imgOneSwitch: false
                    })
                }
            }
        })
    },

    // 删除图片功能
    reBackImg: function (e) {
        let dataset = e.currentTarget.dataset
        let index = dataset.index
        console.log(index)

        let arr = this.data.imgOne
        arr.splice(index, 1)

        if (arr.length < this.data.MAXCOUNTIMAGE && this.data.imgOneSwitch === false) {
            this.setData({
                imgOneSwitch: true
            })
        }

        this.setData({
            imgOne: arr
        })
    },

    // 预览图片
    previewImg: function (e) {
        console.log('放大图片')

        let index = e.currentTarget.dataset.index
        let item = this.data.imgOne[index]

        console.log(item)

        wx.previewImage({
            current: item, // 当前显示图片的http链接
            urls: this.data.imgOne // 需要预览的图片http链接列表
        })
    },

})