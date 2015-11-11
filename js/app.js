// Enemies our player must avoid
var Enemy = function(x0, col, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x0; // ??
    this.y = (col + 1) * 81 - 97; // ??
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Collision detection => use enemy_size starting from relative
    // enemy_coord where the bug drawing actually is within the png
    // file
    this.dwg_coord = [0, 80]
    this.dwg_size = [80, 60];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505)
      this.x = -100;
    if (checkCollision(this, player))
    {
        player.sound_crash.play();
        player.num_collisions++;
        player.resetPosition();
    };
};

// checkCollision function: logic to check whether the enemy
// and player are in collision.
// Returns boolean with result of check.
function checkCollision(enemy, player) {
    // Check for collision with Player: if coordinates of
    // enemy are within the max range of this.collision_coord,
    // then it is a collision
    pos_enemy = [enemy.x + enemy.dwg_coord[0], enemy.y + enemy.dwg_coord[1]];
    pos_player = [player.coord[0] + player.dwg_coord[0], player.coord[1] + player.dwg_coord[1]];
    // Check if player overlaps with enemy (I am assuming they are both
    // square, for simplicity).
    // The check takes into account finds if the coordinates of the player
    // top corner falls within a box from a point in top-left enemy - player size
    // to bottom-right enemy.
    if ((pos_player[0] + player.dwg_size[0]) >= pos_enemy[0] &&
        pos_player[0] <= (pos_enemy[0] + enemy.dwg_size[0]) &&
        (pos_player[1] + player.dwg_size[1]) >= pos_enemy[1] &&
        pos_player[1] <= (pos_enemy[1] + enemy.dwg_size[1]) )
        return true;
    else
        return false;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player: the good guy that has to avoid enemies
var Player = function() {
    // Inital coordinates, where the player starts at the beginning
    // of the game or after a collision; these don't change.
    this.ini_coord = [200,400];
    // Current cooordinates, which change when movement keys are
    // pressed (or a collision happens)
    this.coord = [this.ini_coord[0], this.ini_coord[1]];
    // Amount to move when any key is pressed once
    this.step = 25;

    this.sprite = 'images/char-boy.png';
    this.x_move_range = [-20, 420];
    this.y_move_range = [-10, 410];
    // Position of player drawing within png file and
    // dimensions for collision detection.
    this.dwg_coord = [20,60];
    this.dwg_size = [60, 80];
    // Counter for collisions and goals
    this.num_collisions = 0;
    this.num_goals = 0;
    // Sounds
    this.sound_crash = new Audio('sound/jump1.mp3');
    this.sound_goal = new Audio('sound/jump3.mp3');
};

Player.prototype.update = function(dx, dy) {
    // Chack that player is not out of canvas
    // x axis
    if (this.coord[0] > this.x_move_range[1]) {
        // out of canvas through the right => stay on the right
        this.coord[0] = this.x_move_range[1]
    } else if (this.coord[0] < this.x_move_range[0]) {
        // out of canvas through the left => stay on the left
        this.coord[0] = this.x_move_range[0]
    }
    // y axis
    if (this.coord[1] > this.y_move_range[1]) {
        // out of canvas through the bottom => stay at the bottom
    } else if (this.coord[1] < this.y_move_range[0]) {
        // out of canvas through the top => goal!!
        this.sound_goal.play();
        this.num_goals++;
        this.resetPosition();
    }
    // this.coord[0] = (this.coord[0] > this.x_move_range[1]) ? this.x_move_range[1] : this.coord[0];
    // this.coord[0] = (this.coord[0] < this.x_move_range[0]) ? this.x_move_range[0] : this.coord[0];
    // this.coord[1] = (this.coord[1] > this.y_move_range[1]) ? this.y_move_range[1] : this.coord[1];
    // this.coord[1] = (this.coord[1] < this.y_move_range[0]) ? this.y_move_range[0] : this.coord[1];
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.coord[0], this.coord[1]);
};

Player.prototype.handleInput = function(key) {
    switch(key) {
    case 'left':
        this.coord[0] -= this.step;
        break;
    case 'up':
        this.coord[1] -= this.step;
        break;
    case 'right':
        this.coord[0] += this.step;
        break;
    case 'down':
        this.coord[1] += this.step;
        break;
    }
    console.log("Player.coord: ", player.coord[0], player.coord[1]);
    console.log("Player.coord: ", player.ini_coord[0], player.ini_coord[1]);
};

Player.prototype.resetPosition = function() {
    this.coord[0] = this.ini_coord[0];
    this.coord[1] = this.ini_coord[1];
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [ //new Enemy(-150, 1, 175),
                   //new Enemy(-100, 2, 95),
                   //new Enemy(-125, 3, 125)
                 ];

var player =  new Player();

// Int random number function generator
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Initialise Level => will determine number and speed of enemies
//
function initLevel() {
    // Select Dificulty Level
    var difLevel = prompt("Dificulty Level (1-4):", 1);
    if (!(difLevel >= 1 && difLevel <= 4 )) {
        difLevel = 1;
    }
    switch(difLevel) {
    case "1": // one enemy per row
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 1, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 2, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 3, getRandomInt(75, 175)) );
        break;
    case "2": // two enemies in first row, one in second and third
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 1, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 1, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 2, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 3, getRandomInt(75, 175)) );
        break;
    case "3": // two enemies in first and second rows, one in third
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 1, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 1, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 2, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 2, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 3, getRandomInt(75, 175)) );
        break;
    case "4": // two enemies in each row
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 1, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 1, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 2, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 2, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 3, getRandomInt(75, 175)) );
        allEnemies.push( new Enemy(getRandomInt(-200, -100), 3, getRandomInt(75, 175)) );
        break;
    }

    console.log("Level:", difLevel);
    //////
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
