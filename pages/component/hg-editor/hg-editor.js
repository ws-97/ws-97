// components/hg-editor/hg-editor.js

/**
 * @author 秦玉成
 * 未经允许，请不要擅自改动，如果使用，请在最后说明出处
 */
// const base64 = require('../../../pages/utils/base64');
/* <script src="https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.min.js"></script>  */
//  <script>
//     import { base64 } from 'https://cdn.jsdelivr.net/npm/js-base64@3.7.7/base64.mjs';
// </script> 
// import { base64 } from 'js-base64';
const base64 = require('js-base64').Base64

Component({

    attached: function() {
        // 在组件实例进入页面节点树时执行
        // console.log("在组件实例进入页面节点树时执行")
        console.log("在组件实例进入页面节点树时执行设置内容：",this.data.defaultContent)

            //  // 页面被展示
            //  const that = this;
            //  that.createSelectorQuery().select('#editor').context(function (res) {
            //      console.log("在组件实例进入页面节点树时执行设置内容：",that.data.defaultContent)
            //    that.editorCtx = res.context
            //    that.editorCtx.setContents({
            //        html:that.data.defaultContent    //这里就是设置默认值的地方（html 后面给什么就显示什么）
            //                                    //that.data.content 是我存在 data 里面的数据
            //                                    //注意是 this 赋值的 that，如果用 this 就把上面的 function 改成箭头函数
            //      });
            //  }).exec()
      },
    pageLifetimes: {
        show: function() {
          // 页面被展示
  
        },
        hide: function() {
          // 页面被隐藏
          console.log("页面被隐藏")
        },
        resize: function(size) {
          // 页面尺寸变化
          const that = this;
        //   that.createSelectorQuery().select('#editor').context(function (res) {
              console.log("pageLifetimes resize设置内容：",that.data.defaultContent)
        //     that.editorCtx = res.context
        //     that.editorCtx.setContents({
        //         html:that.data.defaultContent    //这里就是设置默认值的地方（html 后面给什么就显示什么）
        //       });
        //   }).exec()
        }
      },
  /**
   * 组件的属性列表
   */
  properties: {
    /**是否显示工具栏 */
    showTabBar: {
      type: 'Boolean',
      value: true
    },
    placeholder: {
      type: 'String',
      value: '请输入相关内容'
    },
    name: {
      type: 'String',
      value: ''
    },
    question: {
        type: 'String',
        value: ''
      }, 
    defaultContent: {
        type: 'String',
        value: ''
      }, 
    uploadImageURL: {
      type: 'String',
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    


    _onEditorReady: function () {
                                    const that = this;

        setTimeout(function() {        
            console.log("_onEditorReady设置内容：",that.data.defaultContent)

        that.createSelectorQuery().select('#editor').context(function (res) {
            console.log("设置内容：",that.data.defaultContent)
          that.editorCtx = res.context
          that.editorCtx.setContents({
              html:that.data.defaultContent    //这里就是设置默认值的地方（html 后面给什么就显示什么）
                                          //that.data.content 是我存在 data 里面的数据
                                          //注意是 this 赋值的 that，如果用 this 就把上面的 function 改成箭头函数
            });
        }).exec() }, 1000);  //5秒后将会调用执行remind()函数

    },

    

    //插入图片
    _addImage: function (event) {
      let _this = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: function (res) {
          wx.showLoading({
            title: '上传中',
            mask: true
          });
          _this._uploadImage(res.tempFilePaths[0], event.currentTarget.dataset.uploadimageurl);
        }
      });
    },
    _uploadImage: function (tempFilePath, uploadImageURL) {
      let _this = this;
      wx.uploadFile({
        filePath: tempFilePath,
        name: 'image',
        url: uploadImageURL,
        success: function (res) {
          res = JSON.parse(res.data);
          wx.hideLoading({
            success: () => {
              if (res.code === 200) {
                _this.editorCtx.insertImage({
                  src: res.data
                });
              } else {
                wx.showToast({
                  icon: 'error',
                  title: '服务器错误,稍后重试！',
                  mask: true
                })
              }
            },
          });
        }
      });
    },
    //设置斜体
    _addItalic: function () {
      this.editorCtx.format("italic")
    },
    //添加粗体样式
    _addBold: function () {
      this.editorCtx.format("bold")
    },
    //设置标题
    _addHeader: function (e) {
      let headerType = e.currentTarget.dataset.header;
      this.editorCtx.format("header", headerType)
    },
    //设置文字的排列方式
    _addAlign: function (e) {
      let alignType = e.currentTarget.dataset.align;
      this.editorCtx.format("align", alignType);
    },
    //设置列表
    _addList: function (e) {
      let listType = e.currentTarget.dataset.list;
      this.editorCtx.format("list", listType);
    },
    _update: function (e) {
        var that=this

        console.log("点击了更新按钮"+this.data.question+
        "数据为："+this.data.defaultContent)
  
        wx.request({
            url: getApp().globalData.netServerAddrees +
                '/question/update?' +
                'question=' + this.data.question+
                '&answer=' + base64.encodeURL(this.data.defaultContent) ,
            success: function (res) {
                console.log("响应数据：", res.data)
                wx.showToast({
                    title: '更新成功',
                    mask: true
                  })
                wx.hideLoading()
            },
            error: function (e) {
                console.log("问题详情请求失败:" + e)
                wx.hideLoading()
            }
        })
      },
    //撤销
    _undo: function () {
      this.editorCtx.undo();
    },
    //监控输入
    _onInputting: function (e) {
      let html = e.detail.html;
      let text = e.detail.text;
      this.setData({
        defaultContent:e.detail.html
      }
      )
      console.log("输入：htmel",html,"\n\n\ntext:",text)
      this.triggerEvent("input", { html: this.data.defaultContent, text: text }, {});
    }
  }
})
