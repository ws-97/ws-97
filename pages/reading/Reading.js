const localDB = require('../utils/localDB.js')
const _ = localDB.command
localDB.init() // 初始化
var bookTable = localDB.collection('TableBook')
if (!bookTable)
    bookTable = localDB.createCollection('TableBook') // 不存在则先创建
else
    bookTable = localDB.collection('TableBook')

Page(
    {
        data: {

            bookList: [],
            downloadTask: null
        },
        onShow() {
            console.log("本地数据库书表", bookTable, "本地数据库集合数量：", bookTable.get().length)

            if (bookTable.get().length > 0) {
                bookTable.get().forEach(function (book) {
                    console.log("本地数据库中存在书籍：", book)
                })
                this.setData({
                    bookList: bookTable.get()
                })
                // localDB.removeCollection('TableBook')
            } else {
                var that = this
                wx.request({
                    url: getApp().globalData.netServerAddrees + '/book/get',
                    success: function (res) {
                        // console.log(res)
                        var bookListRsp = res.data.result
                        var bookList = JSON.parse(bookListRsp)
                        console.log("前10条数据：", bookList)
                        bookList.forEach(
                            function (book) {
                                book['isLocalExist'] = false
                                console.log("向本地数据库中添加书籍数据：", book)
                                bookTable.add(book)
                            }
                        )

                        that.setData({
                            bookList: bookList
                        })
                    }
                })
            }


        },


        importBook: function (option) {
            console.log("导入图书")
            var that = this
            wx.chooseMessageFile(
                {
                    count: 1,
                    type: 'file',
                    success: function (res) {
                        console.log("选择图书成功", res)
                        var filePath = res.tempFiles[0].path
                        var fileName = res.tempFiles[0].name
                        console.log(filePath)
                        // wx.request(
                        //     {
                        //         method: 'POST',
                        //         header: {
                        //             'content-type': 'multipart/form-data',
                        //             // "Content-Type": "application/x-www-form-urlencoded"
                        //             // 'content-type':'multipart/form-data; boundary=XXX'
                        //
                        //
                        //         },
                        //         // formData: {
                        //         //     'bookName': fileName,
                        //         //     // 'file': res.tempFiles[0],
                        //         //
                        //         // },
                        //         data:{
                        //             'test': fileName,
                        //             'file': res.tempFiles[0],
                        //         },
                        //
                        //         //
                        //         //
                        //         // body: {
                        //         //     'bookName': fileName,
                        //         //     formData: {
                        //         //         'bookName': fileName,
                        //         //         'file': res.tempFiles[0],
                        //         //
                        //         //     },
                        //         // },
                        //
                        //         url: getApp().globalData.netServerAddrees + '/book/add',
                        //         success: function (res) {
                        //             console.log(res)
                        //                 wx.showToast({
                        //                     title: '导入成功',
                        //                     icon: 'success',
                        //                 })
                        //                 wx.openDocument(filePath, {
                        //                     showMenu: true
                        //                     ,
                        //                     success: function (res) {
                        //                         console.log(res)
                        //                     }
                        //                     ,
                        //                     fail: function (res) {
                        //                         console.log(res)
                        //                     }
                        //                     ,
                        //                     complete: function (res) {
                        //                         console.log(res)
                        //                     }
                        //
                        //                 })
                        //             },
                        //         fail: function (res) {
                        //             console.log(res)
                        //         }
                        //
                        //     }
                        // )

                        wx.uploadFile(
                            {
                                url: getApp().globalData.netServerAddrees + '/book/add?bookName=' + fileName,
                                name: "file",
                                filePath: filePath,

                                success: function (res) {
                                    var data = JSON.parse(res.data)
                                    console.log("上传成功", res)
                                    // if (data.code === 200) {
                                    var book = JSON.parse(data.result)
                                    console.log("从服务器返回的书籍数据：", book)
                                    book.cl_save_path = filePath
                                    book.isLocalExist = true
                                    wx.showToast({
                                        title: '导入成功',
                                        icon: 'success',
                                    })
                                    that.data.bookList.push(book)
                                    console.log("更新数据数据book", book)
                                    bookTable.add(book)

                                    that.setData({})
                                    wx.openDocument(
                                        {
                                            type: 'pdf',
                                            filePath: filePath,
                                            showMenu: true
                                            ,
                                            success: function (res) {
                                                console.log(res)
                                            }
                                            ,
                                            fail: function (res) {
                                                console.log(res)
                                            }
                                            ,
                                            complete: function (res) {
                                                console.log(res)
                                            }
                                        })
                                }
                            }
                        )

                    }
                }
            )
        },


        openBook: function (e) {


            var that = this
            var bookBean = e.currentTarget.dataset.book
            console.log("点击了一本书：", e, "输的路径为：",
                e.currentTarget.dataset.book.cl_save_path,
                "本地是否存在：：", bookBean.isLocalExist,
                "this.data.downloadTask:",this.data.downloadTask)
            if (this.data.downloadTask != null) {
                wx.showToast({title: "正在下载中。。。"})
                return
            }


            if (bookBean.isLocalExist) {

                // wx.navigateTo({
                //     // url: '/pages/reading/pdf_reading/PDFReading?fileUrl='+'https://www.pwithe.com/Public/Upload/download/20170211/589ebf8e5bb13.pdf'
                //     url: '/pages/reading/pdf_reading/PDFReading?bookId='+bookBean.cl_book_id+"&bookPath="+bookBean.cl_save_path
                // })
                wx.openDocument({
                    filePath: bookBean.cl_save_path,
                    showMenu: true,
                    success: function (res) {
                        console.log(res)
                    },
                    fail: function (res) {
                        console.log(res)
                    }
                })
            } else {
                that.data.downloadTask = wx.downloadFile({
                    url: getApp().globalData.netServerAddrees + '/book/download?bookId=' + bookBean.cl_book_id,
                    success: function (res) {
                        console.log("下载文件成功", res)
                        if (res.statusCode === 200) {
                            // bookBean.cl_save_path = res.tempFilePath;
                            // bookBean.isLocalExist=true
                            bookTable.updateBookSingle({
                                cl_book_id: bookBean.cl_book_id,
                                cl_save_path: res.tempFilePath,
                                isLocalExist: true
                            })
                            // that.setData({bookBean})
                            // that.openBook(e)
                            wx.openDocument({
                                filePath: res.tempFilePath,
                                showMenu: true,
                                success: function (res) {
                                    console.log(res)
                                }
                            })
                        } else {
                            wx.showToast({
                                title: '下载失败',
                                icon: 'none',
                            })
                        }
                        that.setData(
                            {
                                downloadTask: null
                            }
                        )

                    },
                    fail: function (res) {
                        console.log("下载文件失败", res)
                        that.setData(
                            {
                                downloadTask: null
                            }
                        )
                    }
                })
                that.data.downloadTask.onProgressUpdate(res => {
                    console.log('下载进度', res.progress)
                    console.log('已经下载的数据长度', res.totalBytesWritten)
                    console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)

                    //无效
                    that.setData({
                        downloadProgress: res.progress
                    })

                })
                console.log("开始下载",that.data.downloadTask)
            }
            // console.log("点击了一本书：", e, "输的路径为：", e.currentTarget.dataset.book.cl_save_path)
            // wx.openDocument({
            //     filePath: bookBean.cl_save_path,
            //     success: function (res) {
            //         console.log(res)
            //
            //     }
            //
            //     ,
            //     fail: function (res) {
            //         console.log(res)
            //         wx.downloadFile({
            //             url: getApp().globalData.netServerAddrees + '/book/download?bookId=' + bookBean.cl_book_id,
            //             success: function (res) {
            //                 console.log("下载文件成功", res)
            //                 bookBean.cl_save_path = res.tempFilePath;
            //                 bookTable.updateBookSingle({
            //                     cl_book_id: bookBean.cl_book_id,
            //                     cl_save_path: res.tempFilePath
            //                 })
            //
            //                 that.setData({})
            //                 wx.openDocument({
            //                     filePath: res.tempFilePath,
            //                     success: function (res) {
            //                         console.log(res)
            //
            //                     }
            //
            //                     ,
            //                     fail: function (res) {
            //                         console.log(res)
            //                     }
            //                 })
            //             }
            //         })
            //
            //     }
            // })

            // wx.getFileSystemManager().access({
            //     filePath: e.currentTarget.dataset.book.cl_save_path+"",
            //     success: function (res) {
            //         console.log("本地文件获取成功",res)
            //         wx.openDocument({
            //                 filePath: e.currentTarget.dataset.book.cl_save_path,
            //                 success: function (res) {
            //                     console.log(res)
            //                 }
            //
            //                 ,
            //                 fail: function (res) {
            //                     console.log(res)
            //                 }
            //             }
            //         )
            //     },
            //     fail: function (res) {
            //         console.log("文件打开失败：",res,"等下载的云文件id" ,bookBean.cl_book_id)
            //         wx.downloadFile({
            //             url: getApp().globalData.netServerAddrees + '/book/download?bookId=' + bookBean.cl_book_id,
            //             success: function (res) {
            //                 console.log("下载文件成功", res)
            //                 bookBean.cl_save_path= res.tempFilePath;
            //                 bookTable.update(bookBean)
            //                 that.setData({})
            //                 wx.openDocument({
            //                     filePath: res.tempFilePath,
            //                     success: function (res) {
            //                         console.log(res)
            //
            //                     }
            //
            //                     ,
            //                     fail: function (res) {
            //                         console.log(res)
            //                     }
            //                 })
            //             }
            //         })
            //     }
            // })


            // wx.getFileSystemManager().access({
            //     path: e.currentTarget.dataset.book.cl_save_path,
            //     success: function (res) {
            //         console.log("本地文件获取成功", res)
            //     },
            //     fail: function (res) {
            //         console.log("文件打开失败：", res)
            //
            //     },
            //     complete: function (res) {
            //         console.log("文件打开完成：", res)
            //     }
            // })


            // console.log("点击了一本书：", wx.getFileSystemManager().accessSync(e.currentTarget.dataset.book.cl_save_path))

        }
    });