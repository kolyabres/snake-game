Math.__proto__ = {
    rand: function (min, max) {
        return Math.floor(Math.random() * max) + min;
    }
}


function Part(x, y) {
    this.x = x;
    this.y = y;

    this.copy = function () {
        return new Part(this.x, this.y)
    }


    //порівняння координат двох частин
    this.compare = function (el) {
        return (this.x == el.x && this.y == el.y);
    }

}

function Snake(context) {
    var _self = this;
    _self.food = null;
    _self.fieldSizeX = _self.fieldWidth / _self.scale;
    _self.fieldSizeY = _self.fieldheignt / _self.scale;
    _self.context = context;

    _self.plantFood();

    _self.interval = setInterval(function () {

        _self.move();
        if (_self.mayBeEnd())
            return;

        if (_self.findFood()) {
            _self.eatFood();
            _self.plantFood();
        }

        _self.displaySnake();
    }, _self.speed);
}


Snake.prototype = {
    context: null,              //canvas
    interval: null,
    speed: 150,                 //швидкість руху
    scale: 20,                  //масштаб
    fieldWidth: window.innerWidth,             //розмір поля
    fieldheignt: window.innerHeight,             //розмір поля
    direction: 'down',         //напрямок руху
    nextDirection: 'down',
    parts: [
        new Part(7, 5), // x,y
        new Part(8, 5),
        new Part(9, 5),
        new Part(10, 5),
        new Part(11, 5),
    ],
    badDirections: {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
    },
    buttonsDirections: {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    },


    plantFood: function () {
        this.food = new Part(Math.rand(1, this.fieldSizeX-1), Math.rand(1, this.fieldSizeY-1));
        this.display([this.food]);
    },
    move: function () {
        snake.direction = snake.nextDirection;
        snake.parts.forEach(function (e, i, a) {
            if (i == 0) {
                prev = a[i].copy();
                switch (snake.direction) {
                    case 'left':
                        a[i].x -= 1;
                        break;
                    case'right':
                        a[i].x += 1;
                        break;
                    case 'up':
                        a[i].y -= 1;
                        break;
                    case 'down':
                        a[i].y += 1;
                        break;
                }
            } else {
                tmp = a[i].copy();
                a[i] = prev.copy();
                prev = tmp.copy();
            }


        })

    },
    display: function (data) {
        var _self = this;
        data.forEach(function (e, i, a) {
            var size = _self.scale - 2;
            _self.context.fillRect(e.x * _self.scale, e.y * _self.scale, size, size);
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.fieldWidth, this.fieldheignt);
        this.context.beginPath();
    },

    displaySnake: function () {
        this.clear();
        this.display(this.parts);
        this.display([this.food]);
        this.displayScore();
    },

    displayScore: function () {
        this.context.fillStyle = '#000';
        this.context.font = 'italic 20px sans-serif';
        this.context.textBaseline = 'top';
        this.context.fillText('Score: ' + this.getScore(), 5, 5);
    },
    getScore: function () {
        return this.parts.length - 5;
    },

    changeDirection: function (newDirection) {
        if (this.badDirections[newDirection] == this.direction)
            return this;

        this.nextDirection = newDirection;
        return this;
    },

    changeDirectionButton: function (k) {
        console.log(this.buttonsDirections[k]);
        if (this.buttonsDirections[k])
            this.changeDirection(this.buttonsDirections[k])
    },


    findFood: function () {
        return this.parts[0].compare(this.food);
    },

    eatFood: function () {
        this.parts.push(this.parts[0].copy());

        return this;
    },

    mayBeEnd: function () {
        var _self = this;
        var head = _self.parts[0].copy();
        if (head.x < 0 || head.y < 0 || head.x > _self.fieldSizeX || head.y > _self.fieldSizeY) {
            return _self.theEnd();
        }
        for (var i = 2; i < _self.parts.length; i++) {
            if (head.compare(_self.parts[i])) {
                return _self.theEnd();
            }
        }
        return false

    },

    theEnd: function () {
        this.clear();
        this.context.fillStyle = '#000';
        this.context.font = 'italic 50px sans-serif';
        this.context.textBaseline = 'top';
        var text = "You are Loser!";
        this.context.fillText(text, this.fieldWidth / 2 - 150, this.fieldheignt / 2);
        clearInterval(this.interval);
        return true;
    }
};
