import React from 'react';
import "../styles/img/imgStyle.css"

class Image extends React.Component{
    render(){
        return(
            <div className='image'>
                <img src={this.props.image} alt=""></img>
            </div>
        );
    }

}

export default Image;