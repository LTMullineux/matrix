var rawImg;
var symbolSize = 10;
var w, h;
var pixCols = [];

var streams = [];
var alphabet_1 = ["T", "R", "U", "M", "P"];
var alphabet_2 = ["R", "U", "S", "S", "I", "A"];

// --------------------------------------------------------
function preload() {
  rawImg = loadImage("trump_2.jpg");
  }

// --------------------------------------------------------
function setup() {
  createCanvas(700, 399);
  textSize(10);
  pixelDensity(1);
  // frameRate();

  // create sampled down image, and blow backup
  w = rawImg.width/symbolSize;
  h = rawImg.height/symbolSize;
  img_temp = createImage(w, h);
  img_temp.copy(rawImg, 0, 0, rawImg.width, rawImg.height, 0, 0, w, h);

  // up sample to full window
  img = createImage(rawImg.width, rawImg.height);
  img.copy(img_temp, 0, 0, img_temp.width, img_temp.height, 0, 0, width, height);

  // array for colours processed upfront
  img.loadPixels();
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var i = x + y * width;
      var j = i*4;
      var c = color(img.pixels[j + 0], img.pixels[j + 1], img.pixels[j + 2], img.pixels[j + 3]);
      pixCols[i] = c;
    }
  }

  // Populate streams with streams of symbols
  var _x = 0;
  // var _y = round(random(-500, 0));
  var _y = 0;
  for (var i = 0; i <= width/symbolSize; i++) {
    var stream = new Stream();
    stream.generateSymbols(_x, _y);
    streams.push(stream);
    _x += symbolSize;
  }

}

// --------------------------------------------------------
function draw() {
  background(0, 200);
  for (var i = 0; i < streams.length; i++){
    streams[i].render();
  }
}

// --------------------------------------------------------
function Symbol(_x, _y, _speed, _alphabet) {
  this.x = _x;
  this.y = _y;
  this.speed = _speed;
  this.alphabet = _alphabet;

  this.value;
  this.switchInterval = round(random(20, 40));

  this.setToRandomSymbol = function() {
    if (frameCount % this.switchInterval == 0) {
      this.value = random(this.alphabet); //random(this._alphabet);
    }
  }

  this.rain = function() {
    this.y = (this.y >= height) ? 0 : this.y += this.speed;
  }
}

// --------------------------------------------------------
function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(20, height/symbolSize));
  this.speed = round(random(2, 6));

  if (round(random(1)) == 0){
    this.alphabet = alphabet_1;
  } else {
    this.alphabet = alphabet_2;
  }

  this.generateSymbols = function(x, y) {
    for (var i = 0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(x, y, this.speed, this.alphabet);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
      // only draw if on the screen
      if (symbol.y >= 0){
        // get location and pixel colour
        var i = (symbol.x + symbol.y * width) % (width * height);
        var col = pixCols[i].toString();

        fill(col);
        text(symbol.value, symbol.x, symbol.y); //, symbol.x, symbol.y);
      }
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  }
}
