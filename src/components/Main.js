require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from "react-dom";

//获取图片数据信息
var imagesData = require('json!../data/imagesData.json');

//将图片地址添加到imagesData中
imagesData = ((imagesDataArr) => {
    for (let i = 0; i < imagesDataArr.length; i ++) {
        let singleImageData = imagesDataArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imagesDataArr[i] = singleImageData;
    }
    return imagesDataArr;
})(imagesData);

var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

// 单个图片组件
class ImgFigure extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                left: 0,
                top: 0
            },
            hPosRange: {     //左侧,右侧区域图片排布的取值范围
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: {     //上测区域图片排布的取值范围
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state = {
            imagesRangeArr: [
                {
                    pos: {
                        left: 0,
                        top: 0
                    }
                }
            ]
        }
    };
    rearrange(centerIndex) {
        let imagesRangeArr = this.state.imagesRangeArr,
            constant = this.Constant,

            //中间位置
            centerPos = constant.centerPos,

            //左右两侧方向
            hPosRangeY = constant.hPosRange.y,
            hPosRangeLeftSecX = constant.hPosRange.leftSecX,
            hPosRangeRightSecX = constant.hPosRange.rightSecX,

            //上侧方向
            vPosRangeX = constant.vPosRange.x,
            vPosRangeTopY = constant.vPosRange.topY,

            imagesTopArr = [],
            topImageNum = Math.floor(Math.random() * 2),  //取一个或者一个都不取
            imgCenterArr = imagesRangeArr.splice(centerIndex, 1);
        //居中一张图片
        imgCenterArr[0] = {
            pos: centerPos
        };

        //布局上侧图片
        let topImageIndex = Math.floor(Math.random() * (imagesRangeArr.length));
        imagesTopArr = imagesRangeArr.splice(topImageIndex, topImageNum);

        imagesTopArr.forEach((value, index) => {
            imagesTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                }
            }
        });

        //布局 左右两侧的图片
        for (let i = 0, len = imagesRangeArr.length, j = len / 2; i < len; i ++) {
            //前半部分布局左边， 后半部分布局右边
            let hPosRangeLandR = (i  < j) ? hPosRangeLeftSecX : hPosRangeRightSecX;
            imagesRangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeLandR[0], hPosRangeLandR[1]),
                    left: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
                }
            }

        }
        if (imagesTopArr && imagesTopArr[0]) {
            imagesTopArr.splice(topImageIndex, 0, imagesTopArr[0]);
        }
        imgCenterArr.splice(centerIndex, 0, imgCenterArr[0]);

        this.setState({
            imagesRangeArr: imagesRangeArr
        })
    }

    //组件加载完后 给每张图片计算其位置
    componentDidMount() {
        //拿到stage的大小
        const stageDom = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDom.scrollWidth,
            stageH = stageDom.scrollHeight,
            halfStageW = Math.floor(stageW / 2),
            halfStageH = Math.floor(stageH / 2);

        //拿到 imgFigure 的大小
        const imgDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgDom.scrollWidth,
            imgH = imgDom.scrollHeight,
            halfImgW = Math.floor(imgW / 2),
            halfImgH = Math.floor(imgH / 2);

        //计算中间图片的位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        //计算左侧,右侧区域图片排布的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

        //计算上测区域图片排布的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        this.Constant.vPosRange.x[0] = halfStageW - halfImgW;
        this.Constant.vPosRange.x[1] = halfStageW + halfImgW;

        let num = Math.floor(Math.random() * 10);
        this.rearrange(num);
    };

    render() {
        var [controllerLists, imgFigures] = [ [], [] ];

        //图片组件集合
        imagesData.forEach((value, index) => {
                if (!this.state.imagesRangeArr[index]){
                    this.state.imagesRangeArr[index] = {
                        pos: {
                            left: 0,
                            top: 0
                        }
                    }

                }
                imgFigures.push(<ImgFigure data={value} key={index} ref={"imgFigure" + index}
                                           arrange={this.state.imagesRangeArr[index]}/>)
            }
        );

        return (
            <section className="stage" ref="stage">
                <section className="img-area">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerLists}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
