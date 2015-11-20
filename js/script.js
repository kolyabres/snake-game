function getRandomInt(min, max) {
    return Math.floor(Math.random() * max) + min;
}


function Part(x, y) {
    this.x = x;
    this.y = y;
    this.toString = function () {
        return this.x + "_" + this.y;
    }

    this.toArray = function () {
        return [this.x, this.y];
    }

    this.copy = function () {
        return new Part(this.x, this.y)
    }


    //порівняння координат двох частин
    this.compare = function (el) {
        if (this.x !== el.x) return false;
        if (this.y !== el.y) return false;
        return true;
    }

}

var snake = {
    context: null,              //canvas
    interval: null,
    speed: 200,                 //швидкість руху
    scale: 10,                  //масштаб
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


    food: {
        food: null,
        plant: function () {
            snake.food.food = new Part(getRandomInt(1, snake.fieldWidth / snake.scale), getRandomInt(1, snake.fieldheignt / snake.scale));
            snake.display([snake.food.food]);
        }
    },


    init: function (context) {
        var _self = this;

        _self.sizex = snake.fieldWidth / snake.scale;
        console.log(_self.sizex);
        _self.sizey = snake.fieldheignt / snake.scale;
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
        var _self = this
        data.forEach(function (e, i, a) {
            var size = snake.scale - 1;
            _self.context.fillRect(e.x * snake.scale, e.y * snake.scale, size, size);
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

    },

    changeDirection: function (newDirection) {
        if (this.badDirections[newDirection] == this.direction)
            return this;

        this.nextDirection = newDirection;
        return this;
    },

    findFood: function () {
        return this.parts[0].compare(this.food.food);
    },

    eatFood: function () {
        this.parts.push(this.parts[0].copy());
    },

    mayBeEnd: function () {
        var head = snake.parts[0].copy();
        for (var i = 2; i < snake.parts.length; i++) {
            if (head.compare(snake.parts[i])) {
                console.log('end');
                return snake.theEnd();
            }

            if (head.x < 0 || head.y < 0 || head.x > snake.sizex || head.y > snake.sizey) {
                console.log('end2');
                return snake.theEnd();
            }

        }
        return false

    },

    theEnd: function () {
        this.clear();
        this.context.fillStyle = '#000';
        this.context.font = 'italic 50px sans-serif';
        //this.context.textBaseline = 'top';
        this.context.fillText('You are Loser!!!!!!', 50, 50);
        clearInterval(this.interval);
        return true;
    }
};
