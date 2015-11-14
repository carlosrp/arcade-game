// Enemies our player must avoid
/**
 * Enemy class
 */
var Enemy = function(col) {
    // Range for starting point (left of canvas) and speeed
    //
    this.range_start = [-200, -100];
    this.range_speed = [75, 150];
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = getRandomInt(this.range_start[0], this.range_start[1]);
    // y coordinate is function of column
    this.y = (col + 1) * 81 - 97;
    this.speed = getRandomInt(this.range_speed[0], this.range_speed[1]);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Collision detection => use enemy_size starting from relative
    // enemy_coord where the bug drawing actually is within the png
    // file
    this.dwg_coord = [0, 80];
    this.dwg_size = [80, 60];
};

/**
 * Update the enemy's position, required method for game
 * @parameter {float} dt A time delta between ticks
 */
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

/**
 * checkCollision function: logic to check whether the enemy
 * and player are in collision.
 * @param {object} Enemmy Enemy object to check collision with player
 * @param {object} Player Player object
 * @returns {boolean} Result of check
 */
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

/**
 * Draw the enemy on the screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Player class: the good guy that has to avoid enemies
 */
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

/**
 * Update coordinates of player, considering the constraints
 * of the canvas. It also checks when it reaches the water.
 * @param {float} dx Change in x coordinate
 @ @param {float} dy Change in y coordinate
 */
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
        this.coord[1] = this.y_move_range[1];
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

/**
 * Render player
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.coord[0], this.coord[1]);
};

/**
 * Handle keyboard input and make consequent changes
 * in coordinates
 * @param {string} key Code of key pressed and released
 */
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
};

/**
 * Set player to initial position
 */
Player.prototype.resetPosition = function() {
    this.coord[0] = this.ini_coord[0];
    this.coord[1] = this.ini_coord[1];
};

/**
 * Array of enemy objects
 */
var allEnemies = [ ];

/**
 * Player object
 */
var player =  new Player();

/**
 * Int random number  generator
 * @param {int} min Minimum value to return
 * @param {int} max Maximum value to return
 *
 * @returns {int} Random number between min and max
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Initialise Level => will determine number and speed of enemies.
 * Request user to introduce a level between 1 (easier) to
 * 4 (most difficul). Default diffuculty value is 1.
 */
function initLevel() {
    // Select Dificulty Level
    var difLevel = prompt("Dificulty Level (1-4):", 1);
    if (!(difLevel >= 1 && difLevel <= 4 )) {
        difLevel = 1;
    }
    // Create enemies based on Level:
    //   1) One all rows
    //   2) Two first row, one second and third rows
    //   3) Two first and second rows, one third row
    //   4) Two all rows
    //
    // First, one enemy per row (baseline for level 1))
    allEnemies.push( new Enemy(1) );
    allEnemies.push( new Enemy(2) );
    allEnemies.push( new Enemy(3) );
    if (difLevel > "1") {
        // another enemies in first row
        allEnemies.push( new Enemy(1) );
        if (difLevel > "2") {
            // another enemy in second rwo
            allEnemies.push( new Enemy(2) );
            if (difLevel > "3") {
                // another enemy in third row
                allEnemies.push( new Enemy(3) );
            }
        }
    }
};

/**
 * This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
