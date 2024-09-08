
// var base_url =getApp().globalData.netServerAddrees+'/book/load'

//
// var pdfReader = require('../../utils/pdf/build/pdf')
// var pdfWorker = require('../../utils/pdf/build/pdf.worker')

Page({
    data: {
        fileUrl: '',
        // base_url:getApp().globalData.netServerAddrees+'/book/load',
        // base_url: '../../utils/pdf/web/viewer.html',

    },
    onLoad: function (options) {
        console.log("pdf阅读页收到的上页传递过来的", options)
        // this.fileUrl = `${base_url}/test.html?file=`+getApp().globalData.netServerAddrees+"/book/download?bookId="+options.bookId;
        // this.fileUrl = `${base_url}?file=`+options.bookPath;
        // var loadingTask = pdfjsLib.getDocument(options.bookPath)

        // console.log("pdf阅读页", loadingTask)
        // this.fileUrl = this.data.base_url+`?file=https://www.pwithe.com/Public/Upload/download/20170211/589ebf8e5bb13.pdf`;
        // this.fileUrl = 'https://www.baidu.com/';
        // console.log("pdf阅读页", getApp().globalData)
        // this.fileUrl = getApp().globalData.netServerAddrees+'/book/load'+'?bookId='+options.bookId;
        // this.fileUrl = getApp().globalData.netServerAddrees+'/book/load'+'?file='+getApp().globalData.netServerAddrees+"/book/download?bookId="+options.bookId;;
        // this.fileUrl = getApp().globalData.netServerAddrees+"/book/download?bookId="+options.bookId;
        // console.log("pdf阅读页", this.fileUrl)
        // this.setData({
        //     fileUrl: this.fileUrl
        // })
    }
});