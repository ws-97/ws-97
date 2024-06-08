// pages/thesaurus/detail/ThesaurusDetailPage.js
Page(
    {

        /**
         * 页面的初始数据
         */
        data: {
            thesaurusName: "",
            list: [],
            option: ['全部显示', '英译汉', '汉译英', '全部记住了'],
            currentPlayWord: "",
            hiddenSingle: true,
            //  innerAudioContext: wx.createInnerAudioContext({
            //     useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
            // }),
        },

        onLoad: function (options) {
            console.log("收到的数据为：")
            console.log(options)
            this.setData({
                thesaurusName: options.thesaurusName,
                currentTab: 1,
            })
        },
        changeNavBar: function (e) {
            this.setData({
                currentTab: e.currentTarget.dataset.tab_index
            })
            if (this.data.currentTab == 3) {
                wx.request({
                    url: getApp().globalData.netServerAddrees + '/addRemindRecordServlet?thesaurusName=' + this.data.thesaurusName,
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


            } else {

                if (this.data.currentTab == 0) {
                    this.data.list.forEach(
                        function (item, index) {
                            item.hiddenAnswer = true
                        }
                    )
                    this.setData({
                        list: this.data.list
                    })
                }
            }
        },
        getImageList: function (params) {
            console.log("解析图片数据：", params)
            if (params.cl_image) {
                console.log("解析图片数据：", params.cl_image)
                try {
                    return JSON.parse(params.cl_image)
                } catch {
                    return ""
                }

            }
            return []
        },
        // scaleImage:function(Xelement) {
        //
        //     console.log("缩放图片：",Xelement)
        //
        //     var parent=Xelement.parentNode;
        //     parent.style.position="absolute";
        //     Xelement.style.position="absolute";
        //     var left=(parent.clientWidth-Xelement.clientWidth)/2;
        //     var top=(parent.clientHeight-Xelement.clientHeight)/2;
        //     Xelement.style.left=left+"px";
        //     Xelement.style.top=top+"px";
        // },

        clickImage: function (e) {
            console.log("点击的图片：", e)
            if (e.target.dataset.src) {
                var image = e.target.dataset.src
                var imageList = e.target.dataset.srcList
                // var imageList=that.getImageList(image)
                console.log("当前点击的图片", image, "图片列表：", imageList)
                wx.previewImage({
                    current: image, // 当前显示图片的http链接
                    urls: imageList // 需要预览的图片http链接列表
                })
            }
        },
        click_word: function (e) {
            console.log('单击了单词：' + e.currentTarget.dataset.text)
            this.data.list.forEach(
                function (item, index) {
                    console.log("变量:", item.word, e.currentTarget.dataset.text, (item.word.trim() === e.currentTarget.dataset.text.trim()));
                    if (e.currentTarget.dataset.text.trim() === item.word.trim()) {
                        item.hiddenAnswer = false
                        console.log("匹配成功", item)
                    }
                }
            )
            this.setData({
                list: this.data.list
            })

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
                url: getApp().globalData.netServerAddrees + '/queryThesaurus?thesaurusName=' + this.data.thesaurusName,
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
                            cl_image_list: that.getImageList(res.data[index]),
                            hiddenAnswer: true
                        })
                    }

                    that.setData({ //setData在此位置
                        list: temList, //这里把从后台获取到的数值赋给lists
                    })
                    wx.hideLoading()
                    console.log('解析结果：', temList)
                    // console.log(getApp().globalData.netServerAddrees + '/queryAllCreateThesaurusServlet')
                },
                error: function () {
                    wx.hideLoading()
                }

            })
        },

        // playAudio: function (e) {
        //     console.log("点击了播放")
        //     console.log(e.currentTarget.dataset.word)
        //     console.log("当前播放的单词:")
        //     console.log(this.data.currentPlayWord)
        //    const  innerAudioContext= wx.createInnerAudioContext({
        //         useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        //     })
        //     if (this.data.currentPlayWord == e.currentTarget.dataset.word) {
        //         console.log("暂停")
        //        this.data.innerAudioContext.stop()
        //     } else {
        //         this.data.currentPlayWord=e.currentTarget.dataset.word
        //         console.log("播放")
        //         console.log(this.data.innerAudioContext)
        //         this.data.innerAudioContext.src = 'http://dict.youdao.com/dictvoice?audio=' + e.currentTarget.dataset.word
        //         console.log(this.data.innerAudioContext.src )
        //         this.data.innerAudioContext.loop = true
        //         this.data.innerAudioContext.play() // 播放
        //     }
        //     //   innerAudioContext.pause() // 暂停

        //     //   innerAudioContext.stop() // 停止
        // },

        playAudio: function (e) {
            console.log("点击了播放", e.currentTarget.dataset.word, "当前播放的单词:", this.data.currentPlayWord)


            if (this.data.currentPlayWord == e.currentTarget.dataset.word) {
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