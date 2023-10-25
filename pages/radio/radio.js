Page({

    myPageData:"123",
    myPageData1:"1234",
    myPageData:"1234555",


    //页面加载
    onLoad:function(options){
        console.log("onLoad page")
    },

onReady:function(){

    console.log("监听页面初次渲染完成")
},
//页面
onShow:function(){
    console.log("onshow page  页面显示")
},

onHides:function(){
    console.log("页面隐藏")
},

onUnload:function(){
    console.log("页面卸载了")
},


onPullDownRefresh:function(){
    console.log("用户下拉刷新了")
},

onReachBotton:function(){

    console.log("上拉加载更多了")
},

onShareAppMessage:function(){
console.log("点击了右上角的分享")
},


    /**
     * 页面的初始化数据
     */
    data: {
        radioItems: [{
            name: '苹果',
            value: 'apple'
        },
        {
            name: '橙子',
            value: 'orangle',
            checked: 'true'
        },
        {
            name: '梨子',
            value: 'pear'
        },
        {
            name: '草莓',
            value: 'strawberry'
        },
        {
            name: '香蕉',
            value: 'banana'
        },
        {
            name: '葡萄',
            value: 'grape'
        },

        ]
    },
    radioChange: function (e) {
        console.log('radio发生变化，被选中的值是：' + e.detail.value)
    }
})