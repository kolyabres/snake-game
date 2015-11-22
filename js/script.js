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

var snake = {
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


    food: {
        food: null,
        plant: function () {
            snake.food.food = new Part(Math.rand(1, snake.fieldSizeX), Math.rand(1, snake.fieldSizeY));
            snake.display([snake.food.food]);
        }
    },


    init: function (context) {
        var _self = this;

        _self.fieldSizeX = _self.fieldWidth / _self.scale;
        _self.fieldSizeY = _self.fieldheignt / _self.scale;
        _self.context = context;

        _self.food.plant();

        _self.interval = setInterval(function () {

            _self.move();
            if (_self.mayBeEnd())
                return;

            if (_self.findFood()) {
                _self.eatFood();
                _self.food.plant();
            }

            _self.displaySnake();
        }, _self.speed);

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
            var size = snake.scale - 2;
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
        this.display([this.food.food]);
        this.displayScore();
    },

    displayScore: function () {
        var score = this.parts.length - 5;
        this.context.fillStyle = '#000';
        this.context.font = 'italic 20px sans-serif';
        this.context.textBaseline = 'top';
        this.context.fillText('Score: ' + score, 5, 5);
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
        return this.parts[0].compare(this.food.food);
    },

    eatFood: function () {
        this.parts.push(this.parts[0].copy());

        return this;
    },

    mayBeEnd: function () {
        var _self = this;
        var head = _self.parts[0].copy();
        for (var i = 2; i < _self.parts.length; i++) {
            if (head.compare(_self.parts[i])) {
                console.log('end');
                return _self.theEnd();
            }

            if (head.x < 0 || head.y < 0 || head.x > _self.fieldSizeX || head.y > _self.fieldSizeY) {
                console.log('end2');
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
        this.context.fillText('You are Loser!', this.fieldWidth / 2 - 150, this.fieldheignt / 2);
        clearInterval(this.interval);
        return true;
    }
};
