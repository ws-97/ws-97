Page({
	data: {
		imgOneSwitch: true,
		imgOne: [],
        MAXCOUNTIMAGE: 9,
        memorandumName:"",
        memorandumDescription:""

	},

	onLoad: function (options) {
        var that = this
        console.log("收到的数据为：")
        console.log(options)
        this.setData({
            memorandumName: options.memorandumName,
        })

        wx.request({
            url: getApp().globalData.netServerAddrees + '/queryMemorandum?memorandumName='+this.data.memorandumName,
            success: function (res) {
                console.log(res.data)
                var srcImage=res.data.imageList;
                console.log("请求图片数据结果")
                console.log(srcImage)
                // if(srcImage.)
                var st =srcImage.split(",")

                console.log(st)
                st.forEach(element => {
                //   that.data.imgOne.concat(that.getBase64ImageUrl(srcImage))
                that.data.imgOne.push(that.getBase64ImageUrl(element))

                });
                that.setData({ //setData在此位置
                    // thesauruslist: temList, //这里把从后台获取到的数值赋给lists
                    imgOne:that.data.imgOne,
                    memorandumDescription:res.data.description,
                    memorandumName:res.data.memorandumName
                })

                console.log("base转换结果")
                console.log(that.data.imgOne)
                wx.hideLoading()

            },
            error: function (e) {
                console.log(e)
                wx.hideLoading()
            }
        })


	},
   //把base64转换成图片
   getBase64ImageUrl: function(base64Url) {
       console.log("getBase64ImageUrl    "+base64Url)
    /// 获取到base64Data
    var base64Data = base64Url
    /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
    base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
    /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
    const base64ImgUrl = "data:image/png;base64," + base64Data
    /// 得到的base64ImgUrl直接给图片:src使用即可
    return base64ImgUrl;
},

	// 保存到 存储 & 数据库
	onSave: function () {
        var that = this
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
        console.log("更新图片：")
        console.log(this.data.imgOne)
        // 图片上传
        for (let i = 0; i < imgLength; i++) {
              promiseArr.push(this.data.imgOne[i].toString().replace("data:image/png;base64,",""));
        }
        console.log(promiseArr)
        wx.request({
            url: getApp().globalData.netServerAddrees + '/updateMemorandumByString',
            // header:{'content-type':'multipart/form-data;boundary=1634796333288'},
            header:{'content-type':'application/x-www-form-urlencoded'},
            method:"POST",
            data:  {
                memorandumName: that.data.memorandumName,
                description: that.data.memorandumDescription,
                imageFiles: promiseArr
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

                // let tempArr = that.data.imgOne.concat(res.tempFilePaths)
                console.log("选择图片转移")
                console.log(res.tempFilePaths)
               var srcImage=that.getBase64ImageUrl(wx.getFileSystemManager().readFileSync(res.tempFilePaths.toString(), 'base64'))
                that.data.imgOne.push(srcImage)
               that.setData({
                    // 'imgOne': tempArr
                    imgOne:that.data.imgOne
				})

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
