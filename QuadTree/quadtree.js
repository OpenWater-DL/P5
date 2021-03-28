class Point {

    constructor(x, y,userData) {
        this.x = x;
        this.y = y;

        this.userData = userData;
    }

}

class Rectangle {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  
    contains(point) {
      return (
        point.x >= this.x - this.w &&
        point.x <= this.x + this.w &&
        point.y >= this.y - this.h &&
        point.y <= this.y + this.h
      );
    }
  
    intersects(range) {
      return !(
        range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h
      );
    }
  }


class Circle { //用来作为侦测范围的圆
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r ;//用来比较大小的

    }

    contains(point) {  //范围和点的关系
        //勾股定理
        let d = Math.pow(point.x - this.x,  2)+Math.pow(point.y-this.y,2);//pow(x,y)是x的y次方
                return d <= this.rSquared; //表示point的圆心是在circle的范围内。

    }

    intersects(range){//范围和quadTree的关系

        let  vCircle = createVector(this.x,this.y);
        let vRange =createVector(range.x,range.y);
        
        //该算法参考笔记《如何判断矩形和圆相交》核心是判断圆心到矩形的最短距离是否小于r；
        let d = createVector(abs(range.x-this.x),abs(range.y-this.y)); //第1步：转换至第一象限。

        //第2步：求圆心至矩形的最短距离矢量。
        let h = createVector(range.w,range.h); //矩形中心至一角的向量。(第一象限)
        let u = p5.Vector.sub(d,h); 
        if (u.x<0) u.set(0,u.y);
        if(u.y<0) u.set(u.x,0);

        return  p5.Vector.mag(u)<=this.r;

    }




}






class QuadTree {
    constructor(boundary, capacity) {
      if (!boundary) {
        throw TypeError('boundary is null or undefined');
      }
      if (!(boundary instanceof Rectangle)) {
        throw TypeError('boundary should be a Rectangle');
      }
      if (typeof capacity !== 'number') {
        throw TypeError(
          `capacity should be a number but is a ${typeof capacity}`
        );
      }
      if (capacity < 1) {
        throw RangeError('capacity must be greater than 0');
      }
      this.boundary = boundary;
      this.capacity = capacity;
      this.points = [];
      this.divided = false;
    }
  
    subdivide() {
      let x = this.boundary.x;
      let y = this.boundary.y;
      let w = this.boundary.w / 2;
      let h = this.boundary.h / 2;
  
      let ne = new Rectangle(x + w, y - h, w, h);
      this.northeast = new QuadTree(ne, this.capacity);
      let nw = new Rectangle(x - w, y - h, w, h);
      this.northwest = new QuadTree(nw, this.capacity);
      let se = new Rectangle(x + w, y + h, w, h);
      this.southeast = new QuadTree(se, this.capacity);
      let sw = new Rectangle(x - w, y + h, w, h);
      this.southwest = new QuadTree(sw, this.capacity);
  
      this.divided = true;
    }
  
    insert(point) {
      if (!this.boundary.contains(point)) {
        return false;
      }
  
      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      }
  
      if (!this.divided) {
        this.subdivide();
      }
  
      if (
        this.northeast.insert(point) ||
        this.northwest.insert(point) ||
        this.southeast.insert(point) ||
        this.southwest.insert(point)
      ) {
        return true;
      }
    }
  
    query(range, found) {
      if (!found) {
        found = [];
      }
  
      if (!range.intersects(this.boundary)) {
        return found;
      }
  
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
  
      return found;
    }
  }
  
  