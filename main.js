var canvas = document.getElementById('canvas');//定位canvas元素
var context = canvas.getContext('2d');//canvas的2d上下文
var using = false; 
var usingEraser = false;//是否使用橡皮
var lastDot = {"x":undefined,"y":undefined}
var lineWidth = 2 ;


/***主要代码-默认使用画笔*****/
autoSetCanvasSize();
listenToUser();

/*画笔橡皮切换*/
/* 切换到画笔 */
brush.onclick = () => {
  usingEraser = false;
  brush.classList.add('active');
  eraser.classList.remove('active');
  clear.classList.remove('active');
  download.classList.remove('active');
}
//切换到橡皮
eraser.onclick = () => {
  usingEraser = true;
  eraser.classList.add('active');
  brush.classList.remove('active');
  clear.classList.remove('active');
  download.classList.remove('active');
}

/* 清除画布 */
clear.onclick = () => {
  clear.classList.add('active');
  brush.classList.remove('active');
  eraser.classList.remove('active');
  download.classList.remove('active');
  context.clearRect(0,0,canvas.width,canvas.height);
}

/*下载画布*/
download.onclick = () => {
  download.classList.add('active');
  brush.classList.remove('active');
  eraser.classList.remove('active');
  clear.classList.remove('active');
  var url = canvas.toDataURL();
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = '刚出炉的画';
  a.targrt = '_blank'; 
  a.click(); 
}

/*画笔颜色*/
black.onclick = () => {
  context.strokeStyle = 'black';
  black.classList.add('active');
  red.classList.remove('active');
  green.classList.remove('active');
  blue.classList.remove('active');
}
red.onclick = () => {
  context.strokeStyle = 'red';
  black.classList.remove('active');
  red.classList.add('active');
  green.classList.remove('active');
  blue.classList.remove('active');
}
green.onclick = () => {
  context.strokeStyle = 'greenyellow';
  black.classList.remove('active');
  red.classList.remove('active');
  green.classList.add('active');
  blue.classList.remove('active');
}
blue.onclick = () => {
  context.strokeStyle = '#11ffff';
  black.classList.remove('active');
  red.classList.remove('active');
  green.classList.remove('active');
  blue.classList.add('active');
}

/*画笔粗细*/
thin.onclick = () => {
  lineWidth = 2 ;
  thin.classList.add('active');
  thick.classList.remove('active');
}
thick.onclick = () => {
  lineWidth = 8 ;
  thin.classList.remove('active');
  thick.classList.add('active');
}
//防止手机上画板上下移动
document.addEventListener("touchmove", (e)=>{e.preventDefault()}, false)

/*************自定义函数工具************/

/*画线*/
function drawLine(x1,y1,x2,y2){
  context.beginPath();
  context.lineWidth = lineWidth;
  context.moveTo(x1,y1); //起点
  context.lineTo(x2,y2); //终点
  context.stroke();
  context.closePath();
}

/*JS设置画布宽高-全屏显示-需实参*/
function setCanvasSize(canvas){
 canvas.width = document.documentElement.clientWidth;
 canvas.height = document.documentElement.clientHeight;
}

/*自动设置画布宽高-不需参*/
function autoSetCanvasSize(){
  setCanvasSize(canvas);
  window.onresize = ()=>{setCanvasSize(canvas)}
} 

/*特性检测-是否支持触屏*/ 
function listenToUser(){
  if('ontouchstart' in window){
    touchDetect();   //触屏设备（可点击）
    mouseDetect();
  }else{ 
    mouseDetect();//非触屏设备-监听鼠标动作
  }
}

/*支持触屏设备*/
function touchDetect(){
  //1.0开始摸
  canvas.ontouchstart = (e) => { 
    using = true;
    var x = e.touches[0].clientX; //(clientX,clientY)是相对于视口的坐标
    var y = e.touches[0].clientY;
    if(!usingEraser){
      lastDot = {"x":x,"y":y} //把鼠标按下的点存到全局变量里了,哪里都能用
    }else{
      context.clearRect(x-5,y-5,10,10);//橡皮的大小规模
    }
  }
  //2.0摸来摸去
  canvas.ontouchmove = (e) => {
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;
    if(using){
        if(!usingEraser){
          var newDot = {"x":x,"y":y}
          drawLine(lastDot.x,lastDot.y,newDot.x,newDot.y);
          lastDot = newDot;
        }else{
          context.clearRect(x-5,y-5,10,10);//橡皮的大小
        }
    }else{
      return 
    }
  }
  //3.0摸完了
  canvas.ontouchend = () => {
    using = false;
    lastDot = {'x':undefined,'y':undefined}
  }
}

/*支持鼠标设备*/
function mouseDetect(){
  //1.0按下鼠标
  canvas.onmousedown = (e) => {
    using = true;
    var x = e.clientX; //(clientX,clientY)是相对于视口的坐标
    var y = e.clientY;
    if(!usingEraser){
        lastDot = {"x":x,"y":y} //把鼠标按下的点存到全局变量里了,哪里都能用
    }else{
        context.clearRect(x-5,y-5,10,10);//橡皮的大小规模
    }
  }
  //2.0移动鼠标
  canvas.onmousemove = (e) => {
    var x = e.clientX;
    var y = e.clientY;
    if(using){
      if(!usingEraser){
          var newDot = {"x" : x ,"y": y }
          drawLine(lastDot.x,lastDot.y,newDot.x,newDot.y);
          lastDot = newDot;
      }else{
          context.clearRect(x-5,y-5,10,10);//橡皮的大小
      }
    }else{
      return
    }
  }
  //3.0松开鼠标
  canvas.onmouseup = ()=>{
    using = false;
    lastDot = {'x':undefined,'y':undefined}
  }
}

