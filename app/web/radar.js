class Radar {
    /**
     * Set up the object 
     */
    constructor() {
        // define the configuration
        this.config = {
            CANVAS_WIDTH: 800,
            CANVAS_HEIGHT: 500,
            DEFAULT_ANGLE: 90,
            DEFAULT_DISTANCE: 150,
            MAX_DISTANCE: 150,
            MIN_DISTANCE: 5,
            RADAR_SWEEP_LENGTH: 400,
            RADAR_MAX_POINTS: 20,
        };
        
        // set up the radar data
        this.data = [];
        this.sweepLine = {};

        // set up the canvas context 
        this.ctx = document.getElementById('radar').getContext('2d');
        this.clear();
    }

    /**
     * Initialises the radar canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
    }

    /**
     * Updates the radar dataset
     */
    update(data) {
        let angle = data.angle || this.config.DEFAULT_ANGLE;
        let distance = data.distance || null;

        // flip the angle, because the arduino's servo motor is 
        // mounted upside-down.
        angle = Math.abs(180 - angle); 

        // normalise the distance
        if (distance > this.config.MAX_DISTANCE) {
            distance = this.config.MAX_DISTANCE;
        } else if (distance < this.config.MIN_DISTANCE) {
            distance = this.config.MIN_DISTANCE;
        }

        if (distance) {
            distance = (distance / this.config.MAX_DISTANCE) * this.config.RADAR_SWEEP_LENGTH; 
        }

        // update the radar data
        this.data.push({ angle, distance });
        this.sweepLine = { angle, distance };

        // remove older data
        if (this.data.length > this.config.RADAR_MAX_POINTS) {
            this.data.shift();
        }
    }

    /**
     * The animation loop
     */
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    /**
     * Redraw the canvas
     */
    draw() {
        this.clear();
        
        // draw all the points 
        let alpha = 0;
        this.data.forEach((pointData) => {
            alpha = alpha + (1 / this.config.RADAR_MAX_POINTS);
            const point = new Point(pointData.angle, pointData.distance, this.config);
            point.draw("green", alpha);
        });

        // now draw the sweep line
        const sweepLine = new SweepLine(this.sweepLine.angle, this.config.RADAR_SWEEP_LENGTH, this.config);
        sweepLine.draw("white");
    }
}

/**
 * An abstract base shape class with shared code for rendering any shape
 */
class BaseShape {
    /**
     * Sets up the object
     */
     constructor(angle, distance, config) {
        this.angle = angle;
        this.distance = distance;
        this.config = config;
        this.ctx = document.getElementById('radar').getContext('2d');
    }

    /**
     * Calculate the coordinates of the shape
     * 
     * This returns null if no point should be drawn.
     * 
     * @return { startX, startY, endX, endY }|null
     */
    getXY() {
        let angle = this.angle;
        let distance = this.distance;

        if (distance === null) {
            return null;
        }

        const pivotX = this.config.CANVAS_WIDTH / 2; 
        const pivotY = this.config.CANVAS_HEIGHT;

        // Start at bottom-centre of canvas
        let endX, endY, diffX, diffY;
        let side = "left";
    
        // do all triginometry on the left side for convenience
        if (angle > 90) {
            angle = 90 - (angle - 90);
            side = "right";
        } else {
            side = "left";
        }

        // Work out the endPosXY.
        // 0,0 is top left of canvas
        let radians = angle * (Math.PI/180);
        if (angle == 0) {
            diffX = distance;
            diffY = 0;
        } else if (angle == 90) {
            diffX = 0;
            diffY = distance;
        } else {
            diffX = Math.floor(Math.cos(radians) * distance);
            diffY = Math.floor(Math.sin(radians) * distance);
        }
        endY = pivotY - diffY;
        if (side === "left") {
            endX = pivotX - Math.abs(diffX);
        } else {
            endX = pivotX + Math.abs(diffX);
        }

        return {
            pivotX,
            pivotY,
            endX,
            endY
        };
    }
}

/**
 * A point on the radar
 */
class Point extends BaseShape {
    draw(color, alpha = 1) {
        const { endX, endY } = this.getXY();
        if (endX && endY) {
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.moveTo(endX, endY);
            this.ctx.fillRect(endX - 5, endY - 5, 10, 10);
        }
    }
}

/**
 * A sweep line on the radar
 */
class SweepLine extends BaseShape {
     draw(color, alpha= 1) {
        const { pivotX, pivotY, endX, endY } = this.getXY();
        if (endX && endY) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.moveTo(pivotX, pivotY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    };
}
