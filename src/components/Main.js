require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

var imagesData = require('json!../data/imagesData.json');

//获取区间内的一个随机值
var getRandomNum = ((low, high) => Math.floor(Math.random() * (high - low) + low));

//生成随机-30°~30° 的角度
var getRandomRotate = () => {
    let deg = (Math.random() > 0.5) ? '+' : '-';
    return deg + Math.ceil(Math.random() * 30);
};

//获取图片地址添加到imagesData中
(function (imagesURL) {
    for (let i = 0; i < imagesURL.length; i ++) {
        var singleImageURL = imagesURL[i];
        singleImageURL.imgURL = require('../images/' + singleImageURL.fileName);
        imagesURL[i] = singleImageURL;
    }
    return imagesURL;
}(imagesData));


//单个图片组件
class ImagesFigure extends React.Component {
    constructor(props) {
        super(props);
        //bind(this)
        this.handleClick = this.handleClick.bind(this);
    }

    //imageFigure 点击处理函数
    handleClick(e) {
        this.props.imageRange.isCenter ? this.props.inverse() : this.props.center();
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        var styleObj = {};
        if (this.props.imageRange.pos) styleObj = this.props.imageRange.pos;

        if (this.props.imageRange.rotate) {
            (['Moz', 'Ms', 'Webkit', '']).forEach((value) => {
                styleObj[value + 'Transform'] = 'rotate(' + this.props.imageRange.rotate + 'deg)';
            })
        }

        let imgFigClassName = 'img-figure';

        if (this.props.imageRange.isCenter) styleObj.zIndex = 11;
        imgFigClassName += this.props.imageRange.isInverse ? ' is-inverse' : '';

        return (
            <figure className={imgFigClassName} style={styleObj} onClick={this.handleClick}>
                <img className="img-i" src={this.props.data.imgURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2>{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p style={styleObj.rotate}>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

//单个控制按钮组件
class ControllerLists extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        this.props.imageRange.isCenter ? this.props.inverse() : this.props.center();

        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let controllerClassName = 'controller';
        if (this.props.imageRange.isCenter) {
            controllerClassName += ' is-center';
            if (this.props.imageRange.isInverse) controllerClassName += ' is-inverse';
        }

        return (
            <span className={controllerClassName}  onClick={this.handleClick}>
            </span>
        );
    }
}

class GalleryByReactApp extends React.Component {
    constructor(props) {
        super(props);
        this.Constant = {
            centerPos: {
                top: 0,
                left: 0
            },
            //水平方向取值范围
            hRangePos: {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            //垂直方向取值范围
            vRangePos: {
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state = {
            imagesRangeArr: [
                /*{
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,  //旋转角度
                    isInverse: false,   //正反面
                    isCenter: false     //是否居中
                }*/
            ]
        };
    }

    inverse(index) {
        return () => {
            let imagesRangeArr = this.state.imagesRangeArr;
            imagesRangeArr[index].isInverse = !imagesRangeArr[index].isInverse;
            this.setState({
                imagesRangeArr: imagesRangeArr
            })
        }
    }

    //重新布局所有图片
    rearrange(centerIndex) {
        let imagesRangeArr = this.state.imagesRangeArr,
            constant = this.Constant,

            //中间图片信息
            centerPos = constant.centerPos,

            //水平方向(左右两侧)
            hRangePos = constant.hRangePos,
            hRangePosLeftSecX = hRangePos.leftSecX,
            hRangePosRightSecX = hRangePos.rightSecX,
            hRangePosY = hRangePos.y,

            //垂直方向(上侧)
            /*vRangePos = constant.vRangePos,
            vRangePosX = vRangePos.x,
            vRangePosTopY = vRangePos.topY,
            //上侧图片信息
            topImgNum = Math.floor(Math.random() * 2),
            topImgIndex,topImgArr,*/
            centerImgRangeArr = imagesRangeArr.splice(centerIndex, 1);

        //首先居中中间图片,居中图片不需要旋转角度
        centerImgRangeArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        //布局上侧图片
        /*topImgIndex = Math.floor(Math.random() * (imagesRangeArr.length - topImgNum));
        console.log(vRangePosTopY);
        if (topImgNum > 0) {
            topImgArr = imagesRangeArr.splice(topImgIndex, topImgNum);
            topImgArr.forEach((index) => {
                topImgArr[index] = {
                    pos: {
                        top: getRandomNum(vRangePosTopY[0], vRangePosTopY[1]),
                        left: getRandomNum(vRangePosX[0], vRangePosX[1])
                    },
                    rotate: getRandomRotate(),
                    isCenter: false
                };
            });
            console.log(topImgArr[0])
        }*/

        //布局左右两侧的图片
        for (let i = 0,k = imagesRangeArr.length / 2; i < imagesRangeArr.length; i ++) {
            var imgRangeLandR;
            imgRangeLandR = (i < k) ? hRangePosLeftSecX : hRangePosRightSecX;
            imagesRangeArr[i] = {
                pos: {
                    top: getRandomNum(hRangePosY[0], hRangePosY[1]),
                    left: getRandomNum(imgRangeLandR[0], imgRangeLandR[1])
                },
                rotate: getRandomRotate(),
                isCenter: false
            };
        }

        // stage改变重新渲染
        /*if (topImgArr && topImgArr[0]) {
            topImgArr.splice(topImgIndex, 0, topImgArr[0]);
        }*/
        imagesRangeArr.splice(centerIndex, 0, centerImgRangeArr[0]);
        this.setState({
            imagesRangeArr: imagesRangeArr
        })
    }

    //利用rearrange居中对应图片
    center(index) {
        return () => {
            this.rearrange(index)
        }
    }

    componentDidMount() {
        //拿到stage大小
        let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,

            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //拿到一个imgFigure的大小
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,

            halfImgW = Math.ceil(imgW / 2),
            thirdOfStageWImgW = Math.ceil(imgW / 3),
            thirdOfStageWImgH = Math.ceil(imgH / 3);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - thirdOfStageWImgH * 2
        };

        //计算左侧,右侧区域图片排布的取值范围
        this.Constant.hRangePos.leftSecX[0] = -thirdOfStageWImgW;
        this.Constant.hRangePos.leftSecX[1] = halfStageW - halfImgW * 3;

        this.Constant.hRangePos.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hRangePos.rightSecX[1] = stageW - thirdOfStageWImgW * 2;

        this.Constant.hRangePos.y[0] = -thirdOfStageWImgH;
        this.Constant.hRangePos.y[1] = stageH - thirdOfStageWImgW * 2;

        //计算上测区域图片排布的取值范围
        this.Constant.vRangePos.topY[0] = -thirdOfStageWImgH;
        this.Constant.vRangePos.topY[1] = halfStageH - thirdOfStageWImgH * 3;

        this.Constant.vRangePos.x[0] = halfStageW - imgW;
        this.Constant.vRangePos.x[1] = halfStageW;

        //随机居中的图片index 重新布局所有图片
        let num = Math.floor(Math.random() * 10);
        this.rearrange(num);
    }

    render() {
        var imagesFigure = [],
            controllerLists = [];

        //组件对应图片信息
        imagesData.forEach(
            (value, index) => {
                if (!this.state.imagesRangeArr[index]) {
                    this.state.imagesRangeArr[index] = {
                        pos: {
                            left: 0,
                            top: 0
                        },
                        rotate: 0,
                        isInverse: false,
                        isCenter: false
                    }
                }

                //图片
                imagesFigure.push(
                    <ImagesFigure data={value} key={index} center={this.center(index)} inverse={this.inverse(index)} imageRange={this.state.imagesRangeArr[index]} ref={'imgFigure' + index}/>
                );
                //控制按钮
                controllerLists.push(
                    <ControllerLists key={index} imageRange={this.state.imagesRangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>
                )
            }
        );
        return (
            <section className="stage" ref="stage">
                <section className="img-container">
                    {imagesFigure}
                </section>
                <nav className="controller-nav">
                    {controllerLists}
                </nav>
            </section>

        );
    }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
