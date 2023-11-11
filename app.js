// app.js
/**
 * 小程序组件是视图层 的基本单元，它自带微信风格UI
 * 样式和特定功能效果，例如用户在小程序页面上所看到的
 * 图片文本按钮等都属于小程序组件，小程序为开发者
 * 提供了一系列基础组件，通过这这些组件可以
 * 进行更高效的开发
 * 
 * 一个组件通常包括<开始标签>和</结束标签>
 * 属性：
 * class :组件的样式类 该属性值在WXSS中定义有关
 * 样式内容的设置
 * style:组件 的内联样式 可以动态设置内链样式
 * hidden: 组件的显示/隐藏
 * 
 */
App({


    onload: function (options) {
        console.log(this.globalData.ws4736)
        // wx.request({
        //   url: this.globalData.netServerAddrees+'ep/getInProgressThesaurusAndStartLooper',
        //   success:function(res){
        //       console.log("请求所有未完成的数据：")
        //       console.log(res)
        //   }
        // })
    },
    globalData: {
        userinfo: null, //这是一个全局变量
        ws4736: null,
        // netServerAddrees:"http://192.168.0.100:8080",
        // 192.168.0.101
                // netServerAddrees:"http://10.0.30.213:8080",

        netServerAddrees:"http://103.97.128.236:8080",

        receiveTime: wx.getStorageSync('receiveTime'),



    },



    /**
     * 当小程序初始化完成时，会触发  onLaunch(全局只会触发一次)
     */
    onLaunch: function () {
        console.log("小程序初始化完成")
        console.log(" wx.getStorageSync('receiveTime')"+ wx.getStorageSync('receiveTime'))

    },




})