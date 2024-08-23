//pages/upcoming/upcoming.js
Page({


    /**
     * 页面的初始数据
     */
    data: {

        // navbar: ['创建词单', '创建备忘录', '已创建', '进行中', '已完成'],
        navbar: ['创建词单', '已创建', '已创建', '已完成'],

        tabList: [{
            id: 0,
            value: '创建词单',
            isActive: false
        },

            {
                id: 1,
                value: '已创建',
                isActive: true
            },
            {
                id: 2,
                value: '进行中',
                isActive: false
            },
            {
                id: 3,
                value: '已完成',
                isActive: false
            },
        ],


        currentTab: 1,
        thesauruslist: [],
        //创建词单页所需变量
        createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds(),
        capacity: 10,
        openRandom: true,
        // nowTime:new Date().toLocaleDateString()+"/"+new Date().getHours()+"/"+new Date().getMinutes()+"/"+new Date().getSeconds()
        //创建备忘录页所需变量开始
        imgOneSwitch: true,
        imgOne: [],
        memorandumDes: "请输入备忘录描述", //备忘录描述
        MAXCOUNTIMAGE: 9,
        //创建备忘录页所需变量 结束

        //创建问题单页所需变量开始
        questionlist: [],

        //搜索问题时候创建的临时词单
        searchResultList: [],


        //创建问题单页所需变量技术


    },

    switchChange: function (e) {
        console.log("开启随机：", e);
        this.data.openRandom = e.detail.value


    },
    //顶部tab点击事件
    tabsItemChange(e) {
        console.log("tabsItemChange:", e)
//清楚记录
        this.data.tabList.forEach(element => {
            element.isActive = false
        });
//设置当前所选项
        this.data.tabList[e.detail.index].isActive = true
        console.log(this.data.tabList)
        //更新数据
        this.setData({
            tabList: this.data.tabList
        })
        this.setData({
            currentTab: e.detail.index,
            capacity: 10
        })
        wx.showLoading({
            title: '加载中',
        })
        // e.currentTarget.dataset.tab_name..color="#0000ff"
        if (getApp().globalData.netServerAddrees.toString().includes("97")) {
            console.log("当前是正式环境 订阅消息")
            this.subscribleMessage()
            //当前是正式环境
        }
        if (e.detail.index === 0) {
            this.setData({
                createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds()
            })
            wx.hideLoading()
        } else if (e.detail.index === 1) {
            // this.setData({
            //     createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds()
            // })
            // console.log("问题单页")
            // // wx.hideLoading()
            // this.getHasCreateQuestion()
            this.getHasCreateThesaurus()
            console.log("执行获取已创词单")
        } else if (e.detail.index === 2) {
            this.getInProgressThesaurus()
            console.log("执行获取进行中词单")
        } else {
            this.getHasFinshedThesaurus()
            console.log("执行获取已完成词单")
        }

    },
    onShow: function () {
        if (this.data.currentTab === 1) { //进入默认页面
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
    getMemorandumDesValue(e) {
        console.log(e.detail) // {value: "ff", cursor: 2}  
        this.data.memorandumDes = e.detail.value
    },
    createThesaurus: function (e) {
        e.currentTarget.dataset.tab_index
        wx.request({
            url: getApp().globalData.netServerAddrees + '/createThesaurus?thesaurusName=' +
                this.data.createThesaurusName + '&thesaurusCapacity=' + this.data.capacity +
                "&isRandom=" + this.data.openRandom,
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
    // changeNavBar: function (e) {
    //     this.setData({
    //         currentTab: e.currentTarget.dataset.tab_index,
    //         capacity: 10
    //     })
    //     wx.showLoading({
    //         title: '加载中',
    //     })
    //     // e.currentTarget.dataset.tab_name..color="#0000ff"
    //     if (getApp().globalData.netServerAddrees.toString().includes("97")) {
    //         console.log("当前是正式环境 订阅消息")
    //         this.subscribleMessage()
    //         //当前是正式环境
    //     }
    //     if (this.data.currentTab == 0) {
    //         this.setData({
    //             createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds()
    //         })
    //         wx.hideLoading()
    //     } else if (this.data.currentTab == 1) {
    //         // this.setData({
    //         //     createThesaurusName: new Date().toLocaleDateString() + "/" + new Date().getHours() + "/" + new Date().getMinutes() + "/" + new Date().getSeconds()
    //         // })
    //         // console.log("问题单页")
    //         // // wx.hideLoading()
    //         // this.getHasCreateQuestion()
    //         this.getHasCreateThesaurus()
    //         console.log("执行获取已创词单")
    //     } else if (this.data.currentTab == 2) {
    //         this.getInProgressThesaurus()
    //         console.log("执行获取进行中词单")
    //     } else {
    //         this.getHasFinshedThesaurus()
    //         console.log("执行获取已完成词单")
    //     }

    //     // wx.hideLoading()
    // },

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

    onClear: function (e) {
        console.log("清空搜索框")
        this.setData({
            thesauruslist: this.data.searchResultList
        })
    },

    change: function (params) {


        console.log("输入监听器：", params, "param.detail:", params.detail,
            "param.detail.detail:", params.detail.detail,
            "param.currentTarget.detail:", params.currentTarget.detail,
            "searchResultList:" + this.data.searchResultList,
            "param.currentTarget:", params.currentTarget);
        if (params.detail.detail === "") {
            this.setData({
                thesauruslist: this.data.searchResultList
            })
        } else {
            var tempList = [];
            for (var index in this.data.searchResultList) {
                console.log("item:", this.data.searchResultList[index].title)

                if (this.data.searchResultList[index].title.includes(params.detail.detail)) {
                    tempList.push(this.data.searchResultList[index])
                }
            }

            console.log("搜索结果：", tempList)
            this.setData(
                {
                    thesauruslist: tempList
                }
            )
        }


    },
    cancelSearch: function () {
        this.setData({
            thesauruslist: this.data.searchResultList
        })
        console.log("取消搜索", this.data.thesauruslist)

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

    goDetailPage: function (e) {
        console.log("去详情页：", e.target.dataset.text)
        switch (this.data.currentTab) {
            case 1:

            case 3:
                if (e.target.dataset.text.isQuestion) {
                    wx.navigateTo({
                        url: '../question/questionDetail/questionDetailPage?question=' + e.target.dataset.text.title,
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
                        // url: '../thesaurus/thesaurusReview/ThesaurusReviewPage?thesaurusName=' + e.target.dataset.text.title,
                        fail: function (res) {
                            console.log(res)
                        },
                        success: function (res) {
                            console.log(res)
                        }
                    })
                }
                break
            case 2:
                if (e.target.dataset.text.isQuestion) {
                    wx.navigateTo({
                        url: '../question/questionDetail/questionDetailPage?question=' + e.target.dataset.text.title,
                    })
                } else {
                    wx.navigateTo({
                        url: '../thesaurus/thesaurusReview/ThesaurusReviewPage?thesaurusName=' + e.target.dataset.text.title,
                    })
                }
                break
            // case 2:
            //     wx.showToast({
            //         title: '正在提醒计划中', // 标题
            //         icon: 'error', // 图标类型，默认success
            //         duration: 1500 // 提示窗停留时间，默认1500ms
            //     })
        }
        // if (this.data.currentTab != 3) {//如果当前tab不是进行中
        //     if (this.data.currentTab == 4) {//如果当前tab是已完成
        //         wx.navigateTo({
        //             //   url: 'pages/thesaurus/detail/ThesaurusDetailPage',
        //             url: '../thesaurus/thesaurusReview/ThesaurusReviewPage?thesaurusName=' + e.target.dataset.text.title,
        //             fail: function (res) {
        //                 console.log(res)
        //             },
        //             success: function (res) {
        //                 console.log(res)
        //             }
        //         })
        //     } else {
        //         if (this.data.currentTab == 1) {
        //             wx.navigateTo({
        //                 //   url: 'pages/thesaurus/detail/ThesaurusDetailPage',
        //                 url: '../question/qustionDetail?memorandumName=' + e.target.dataset.text.title,
        //                 fail: function (res) {
        //                     console.log(res)
        //                 },
        //                 success: function (res) {
        //                     console.log(res)
        //                 }
        //             })
        //         } else {
        //             wx.navigateTo({
        //                 //   url: 'pages/thesaurus/detail/ThesaurusDetailPage',
        //                 url: '../thesaurus/ThesaurusDetailPage?thesaurusName=' + e.target.dataset.text.title,
        //                 fail: function (res) {
        //                     console.log(res)
        //                 },
        //                 success: function (res) {
        //                     console.log(res)
        //                 }
        //             })
        //         }

        //     }

        // } else {
        //     wx.showToast({
        //         title: '正在提醒计划中', // 标题
        //         icon: 'error', // 图标类型，默认success
        //         duration: 1500 // 提示窗停留时间，默认1500ms
        //     })
        // }

    },

    //获取已创建的词单
    getHasCreateThesaurus: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusAndQuestion',
            success: function (res) {
                console.log("获取已创建的词单:", res.data)
                that.setData({ //setData在此位置
                    thesauruslist: res.data, //这里把从后台获取到的数值赋给lists
                    //备份一次，在搜索的时候会变动
                    searchResultList: res.data
                })
                wx.hideLoading()
                // var temList = new Array()
                // for (var index in res.data) {
                //     temList.push({
                //         title: res.data[index],
                //         isQuestion: false
                //     })
                // }
                // console.log("已创建的词单结果：", temList)
                // wx.request({
                //     url: getApp().globalData.netServerAddrees + '/question/get',
                //     success: function (res) {
                //         console.log(res.data)
                //         for (var index in res.data) {
                //             temList.push({
                //                 title: res.data[index],
                //                 isQuestion: true
                //             })
                //         }
                //         that.setData({ //setData在此位置
                //             thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                //         })
                //         console.log("已创建的数据", that.data.thesauruslist)
                //         wx.hideLoading()
                //     },
                //     error: function (e) {
                //         console.log(e)
                //         wx.hideLoading()
                //     }
                // })
            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }
        })
    },
    // getHasCreateQuestion: function () {
    //     var that = this
    //     wx.request({
    //         url: getApp().globalData.netServerAddrees + '/question/get',
    //         success: function (res) {
    //             console.log(res.data)
    //             var temList = new Array()
    //             for (var index in res.data) {
    //                 temList.push({
    //                     title: res.data[index],
    //                 })
    //             }
    //             that.setData({ //setData在此位置
    //                 questionlist: temList, //这里把从后台获取到的数值赋给lists
    //             })
    //             wx.hideLoading()
    //         },
    //         error: function (e) {
    //             console.log(e)
    //             wx.hideLoading()
    //         }
    //     })
    // },

    stringToBoolean: function (str) {
        switch (str.toLowerCase()) {
            case "true":
            case "yes":
            case "1":
                return true;
            case "false":
            case "no":
            case "0":
            case null:
                return false;
            default:
                return Boolean(str);
        }
    },
    getInProgressThesaurus: function () {
        var that = this
        wx.request({
            url: getApp().globalData.netServerAddrees + '/getInProgressThesaurusServlet',
            success: function (res) {
                console.log(res.data)
                var temList = []
                for (var index in res.data) {
                    //  console.log(res.data[index].cl_remind_time.split(',')[res.data[index].cl_next_remind_point_index])
                    temList.push({
                        title: res.data[index].cl_thesaurusName,
                        isQuestion: Boolean(parseInt(res.data[index].cl_is_question)),
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
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },

            method: "POST",
            data: {
                memorandumName: this.data.createThesaurusName.toString(),
                "description": this.data.memorandumDes.toString(),
                "imageFiles": promiseArr
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