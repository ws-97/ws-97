Page({
	data: {
		imgOneSwitch: true,
		imgOne: [],
		MAXCOUNTIMAGE: 9,
	},

	onLoad: function (options) {
	},

	// 保存到 存储 & 数据库
	onSave: function () {
	
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

		this.OnUpImg()

	},

	OnUpImg: function () {
		let promiseArr = []
		let fileIds = []     // 将图片的fileId存放到一个数组中
		let imgLength = this.data.imgOne.length;

		// 图片上传
		for (let i = 0; i < imgLength; i++) {
			let p = new Promise((resolve, reject) => {
				let item = this.data.imgOne[i]
				let suffix = /\.\w+$/.exec(item)[0]
				
				wx.cloud.uploadFile({    
					cloudPath: 'testdir/' + Date.now() + '-' + Math.random() * 1000000 + suffix, 
					filePath: item,
					success: (res) => {
						console.log(res);
						// console.log(res.fileID)
						fileIds = fileIds.concat(res.fileID)       // 拼接
						resolve()
					},
					fail: (err) => {
						console.error(err)
						reject()
					}
				})
			})
			promiseArr.push(p)
		}

		Promise.all(promiseArr)
			.then((res) => {
				this.addtoDB(fileIds)
			})
			.catch((err) => {
				console.error(err)       // 上传图片失败

				wx.showToast({
					title: '上传失败 请再次点击发布',
					icon: 'none',
					duration: 3000
				})
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
