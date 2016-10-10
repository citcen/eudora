require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

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


// 单个图片组件
class ImgFigure extends React.Component {
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

//
class AppComponent extends React.Component {
    
    render() {
        var [controllerLists, imgFigures] = [ [], [] ];

        //图片组件集合
        imagesData.forEach(
            (value, index) => imgFigures.push(<ImgFigure data={value} key={index} />)
        );

        return (
            <section className="stage">
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
