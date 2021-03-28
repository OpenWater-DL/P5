let particles = [];

function setup() {
    createCanvas(600, 400);
    for (let i = 0; i < 1000; i++) {
        let p = new Particle(random(width), random(height), 5);
        particles.push(p);
    }


}
function draw() {
  background(0);
  let boundary = new Rectangle(300, 200, 600, 400);
  let qtree = new QuadTree(boundary, 4);

  for (let p of particles) {
    let point = new Point(p.x, p.y, p);
    qtree.insert(point);

    p.move();
    p.render();
    p.setHighlight(false);

  }

  for (let p of particles) {

    let range = new Circle(p.x, p.y, p.r * 2);
    let points = qtree.query(range);
    for (let point of points) {
      let other = point.userData;
     
          if (p !== other && p.intersects(other)) {
        p.setHighlight(true);
      }
    }
  }
}
