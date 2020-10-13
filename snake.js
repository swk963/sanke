function Snake(father, arr, speed) {
  // 保存当前身体位置
  this.initBodyList = JSON.stringify(arr)
  this.bodyList = arr
  // 父元素
  this.fatherNode = father
  // 获取列数
  this.col = this.getCol()
  // 获取行数
  this.row = this.getRow()
  // 移动方向 (左 -1)(右 1)(上 列数)(下 -列数)
  this.moveDirection = 1
  // 初始化移速 (默认1秒)
  this.speed = speed || 1000

  // 保存狗粮位置(要先获取行列数)
  this.foodList = []
  // 生成狗粮位置
  this.food()
  // 生成身体
  this.createdBody()
  // 生成狗粮
  this.createdFood()

  // 设置事件监听
  this.setEvent()
  // 开启计时器 (保存计时器)
  this.timeOut = this.openMove()
}
Snake.prototype = {
  constructor: Snake,
  // 初始化 (重开)
  init(){
    // 身体
    this.bodyList = JSON.parse(this.initBodyList)
    // 方向
    this.moveDirection = 1
    // 清空狗粮
    this.foodList = []
    // 生成狗粮位置
    this.food()
    // 生成身体
    this.createdBody()
    // 生成狗粮
    this.createdFood()
    // 开启计时器 (保存计时器)
    this.timeOut = this.openMove()
  },
  // 生成身体
  createdBody() {
    // 排他
    Array.from(this.fatherNode.childNodes).forEach(e => e.className = '')
    this.bodyList.forEach(e => {
      let span = document.querySelector(`span[index='${e}']`)
      span.className = 'snakeColor'
    })
  },
  // 获取列数 (上下移动时使用)
  getCol() {
    // span 宽度
    let spanWidth = this.fatherNode.childNodes[0].offsetWidth
    // 父盒子 宽度
    let fatherWidth = this.fatherNode.offsetWidth
    // 列数
    let col = Math.floor(fatherWidth / spanWidth)
    return col
  },
  // 获取行数
  getRow() {
    // span 高度
    let spanHeight = this.fatherNode.childNodes[0].offsetHeight
    // 父盒子 高度
    let fatherHeight = this.fatherNode.offsetHeight
    // 行数
    let row = Math.floor(fatherHeight / spanHeight)
    return row

  },
  // 设置移动方向
  setMoveDirection(val) {
    this.moveDirection = val
  },
  // 移动逻辑
  moveLogic() {
    // 尾巴
    let tail = this.bodyList[0]
    // 头将移动到的单元格
    let item = this.getLastItem() + this.moveDirection
    // 判断出界
    let isOut = this.out(item)
    // 判断是否碰到身体
    let meetBody = this.getMeetBody(item)
    // 判断是否被淘汰
    if (isOut || meetBody) {
      let title = isOut ? '出界' : '吃自己'
      this.closeMove()
      let aaa = confirm(title+'是否重新开始')
      if (aaa){
        this.init()
      }
      return
    }
    // 如果尾巴有食物 本轮就不删
    if (this.foodList.some(e => e === tail)) {
      // 删除屁股上的食物
      this.removeFood()
    } else {
      // 删除蛇屁股
      this.bodyList.shift()
    }
    // 如果吃到食物(头和food位置重合)
    if (item === this.getLastItem(1,this.foodList)) {
      // 生成新食物
      this.food()
    }
    // 添加到数组
    this.bodyList.push(item)
    // 生成蛇
    this.createdBody()
    // 生成狗粮
    this.createdFood()
  },
  // 判断出界
  out(val) {
    let isOut = false
    switch (this.moveDirection) {
      case this.col:
        // console.log('下')
        if (val > this.col * this.row) {
          isOut = true
        }
        break;
      case this.col * -1:
        // console.log('上')
        if (val < 1) {
          isOut = true
        }
        break;
      case -1:
        // console.log('左');
        if (val % this.col === 0) {
          isOut = true
        }
        break;
      case 1:
        // console.log('右');
        if ((val - 1) % this.col === 0) {
          isOut = true
        }
        break;

      default:
        break;
    }
    return isOut
  },
  // 判断碰到身体
  getMeetBody(val) {
    let meetBody = this.bodyList.some(e => e === val)
    return meetBody
  },
  // 设置事件监听 (方向键)
  setEvent() {
    let that = this
    document.onkeydown = function (event) {
      // 获取当前方向
      let direction
      // 上87,38 下83,40 左65,37 右68,39 
      switch (event.keyCode) {
        case 87:
          direction = that.col * -1 // 上
          break;
        case 38:
          direction = that.col * -1 // 上
          break;
        case 83:
          direction = that.col // 下
          break;
        case 40:
          direction = that.col // 下
          break;
        case 65:
          direction = -1 // 左
          break;
        case 37:
          direction = -1 // 左
          break;
        case 68:
          direction = 1 // 右
          break;
        case 39:
          direction = 1 // 右
          break;
        default:
          break;
      }
      if (!direction) return
      // 获取上次移动方向(数组后两位的差来判断)
      let history = that.getHistoryDirection()
      // 不是反向移动并且不是同一方向连点
      if (direction + history !== 0 && history !== direction) {
        that.moveDirection = direction
      }
    }
  },
  // 数组截取 (默认最后一位)
  getLastItem(val, arr) {
    val = val || 1
    arr = arr || this.bodyList
    let item = arr[arr.length - val]
    return item
  },
  // 获取上次移动的方向
  getHistoryDirection() {
    // 最后一位
    let last = this.getLastItem()
    // 倒数第二位
    let two = this.getLastItem(2)
    return last - two
  },
  // 生成狗粮
  createdFood() {
    this.foodList.forEach((e,i)=>{
      let span = document.querySelector(`span[index='${e}']`)
      // 肚子里的食物
      span.className = 'bellyFoodColor'
      // 外面的食物
      if (i === this.foodList.length - 1) span.className = 'foodColor'
    })
  },
  // 根据地图范围获取随机数(新狗粮)
  food() {
    let max = this.col * this.row,
      min = 1,
      food
    do {
      // 获取随机数
      food = Math.floor(min + Math.random() * (max - min))
      // 如果狗粮位置与蛇身体重复 重新获取随机数
    } while (this.bodyList.some(e => e === food))
    this.foodList.push(food)
  },
  // 移除消化的狗粮 (删尾)
  removeFood() {
    // 从食物数组中移除, 添加到蛇的尾部
    this.foodList.shift()
  },
  // api
  // 设置移速 (加速减速) 
  setSpeed(val){
    this.speed = val
  },
  // 关闭移动 (暂停)
  closeMove() {
    clearInterval(this.timeOut)
  },
  // 开始移动 (恢复)
  openMove() {
    // 移动逻辑
    return setInterval(() => {
      this.moveLogic()
    }, this.speed);
  },
}