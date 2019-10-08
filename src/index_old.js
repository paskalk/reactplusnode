import React from "react";
import ReactDOM from "react-dom";
import styles from './style.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Index = () => { 
  console.log(styles);
  //return <div className="newcolor">Hello  React!</div>;
  //return <div className={styles.newcolor}>Hello   React!</div>;
  return <div className={cx('newcolor')}>Hello  React!</div>;
 
};

class listTable extends Component{
  render(){
    return <div>Test</div>;
  }
}

ReactDOM.render(<Index />, document.getElementById("index"));
//console.log("Hello");