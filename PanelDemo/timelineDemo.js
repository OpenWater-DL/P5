let panels = [];
let windows = [];
let panelNum = 4;

let mouseIsPressed = false;
let haveDone = false;

function setup() {
    cnv = createCanvas(windowWidth,windowHeight);
    background(20);
    for (let i = 0; i < panelNum; i++) {
        let imgP = loadImage('img/' + i + '.png');
        let imgW = loadImage('img/Win' + i + '.png');

        panels.push(new Panel(imgP, imgW, i));
        console.log(imgW);
    }

    cnv.mousePressed(function() {
        mouseIsPressed = true;
      if (!haveDone){

    for (let i = 0; i < panels.length; i++) {

      panels[i].isClicked();

  }
haveDone = true;
      }


    });

    cnv.mouseReleased(function() {
        mouseIsPressed = false;
        haveDone = false;
    });

}


function draw() {
    background(230);

    for (let i = 0; i < panels.length; i++) {

        panels[i].isHover();

    }

    for(let j = panels.length-1;j>=0;j--){

      for (let i = 0; i < panels.length; i++) {

        if(panels[i].pId===j){

          panels[i].show();

        }

    }

    }


    fill(255);
}

//  Panel Class

let panelX = 20; //left
let panelY = 10; //top
let panelW = 400;
let panelH = 200;
let d = 10;

class Panel {

    constructor(panelImg, windowImg, id) {
        this.panelImg = panelImg;
        this.windowImg = windowImg;
        this.id = id;
        this.pId = id;
        this.x = panelX;
        this.y = panelY + this.pId * (panelH+d);
        this.targetY = this.y;

        this.winX=panelX+panelW+10+random(2,100);
        this.winY=panelY+this.id*random(20,150);

        this.hover = false;
        this.haveDone = false;
    }


    isHover() {

        if (mouseX > this.x && mouseX < this.x + panelW && mouseY > this.y && mouseY < this.y + panelH) {
            this.hover = true;

        } else {

            this.hover = false;
        }

    }

    isClicked() {

        if (this.hover && mouseIsPressed) {
      
                for (let i = 0; i < panels.length; i++) {

                    if (panels[i].pId < this.pId) {
                        panels[i].pId += 1;
                    }
                }
                this.pId = 0; //positionId = 0 , to the first




                this.haveDone = true;
            

        }
       

    }

    show() {
      this.targetY = panelY + this.pId * (panelH+d);

      if(abs(this.y-this.targetY)>0.1){
                this.y = lerp(  this.y,this.targetY,0.2);
            
      }else{
        this.y = this.targetY;
      }

        image(this.panelImg, this.x, this.y, panelW, panelH);

        // if (this.pId === 0) {

            let targetW = 800;
            // let imgScale = targetW / this.windowImg.width;
            let imgScale = 0.3;
            let windowW = this.windowImg.width * imgScale;
            let windowH = this.windowImg.height * imgScale;
            // image(this.windowImg, panelX + panelW + 10, 10, windowW, windowH);
            image(this.windowImg, this.winX, this.winY, windowW, windowH);


        // }


        if (this.hover && !mouseIsPressed) {
            noFill();
            stroke(16,103,222,80);
            strokeWeight(2);
            rect(this.x, this.y, panelW, panelH);
            strokeWeight(3);
            
            rect(this.winX, this.winY, windowW, windowH);
            // console.log(this.id + ":" + "pid:" + pId+"Done?"+this.haveDone);
        }

    }




}