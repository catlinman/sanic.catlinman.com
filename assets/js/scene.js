// All variables are instantiated in the setup function.

// Store the canvas variable for easy access.
var canvas;

// Variables for managing the particles.
var particleMax, particleSize, particleSpeed, particleDist;

var particles = []; // Main particle object storage.
var particleCount; // Current particle count.

// Particle creation function. Uses window size for particle count.
function createParticles() {
    // Set the correct particle count if it wasn't already set.
    particleCount = (width * height) / 10000;

    // Calculate a count of particles that responds to the screen size.
    var mean = (width * height) / 10000;

    // Iterate over our particle range and start adding data to the particle array.
    for (var i = 0; i < particleCount * particleMult; i++) {
        if (i > mean * particleMult) {
            particles.splice(i, 1); // Delete particles that pass the count.

        } else {
            if (particles[i] == null) {
                // Assign a random positional value to the particle.
                var rndx = random(width);
                var rndy = random(height);

                // Get the distance of the particle to the center of the screen.
                var dist = createVector(rndx, rndy, 0).dist(createVector(width / 2, height / 2, 0));

                // Calculate the force to be applied to the particle.
                var mean = (width + height) / 2;
                var fx = dist < mean / 4 ? (rndx - width / 2) : 0;
                var fy = dist < mean / 4 ? (rndy - height / 2) : 0;

                particles[i] = [
                    createVector(
                        rndx,
                        rndy
                    ),
                    createVector(
                        0, -2
                    ),
                    createVector(
                        rndx + fx,
                        rndy + fy + 2
                    )
                ];
            }
        }
    }

    particleCount = mean;
}

// Drawing loop for particles.
function drawParticles() {
    colorMode(HSB, 100); // Set the correct color mode.

    // Iterate over particles and draw them.
    for (var i = 0; i < particles.length; i++) {
        var pos = particles[i][0]; // Get the position of the first particle.

        // Set the fill color.
        fill(
            ((map(pos.y, 0, height, 15, -3) % 100) + 100) % 100,
            100,
            100
        );

        // Draw the particle.
        ellipse(
            pos.x,
            pos.y,
            map(
                pos.y,
                0,
                height,
                particleSize / 4,
                particleSize + (sin((frameCount + i * 5) / 15) * particleSize)
            )
        );
    }
}

// Main particle physics calculation and mouse response.
function updateParticles() {
    var mousePos = createVector(mouseX, mouseY); // Get the mouse position.

    // Iterate over particles.
    for (var i = 0; i < particles.length; i++) {
        var pos = particles[i][0]; // Current position of particles.
        var vel = particles[i][1]; // Current velocity of particles.
        var ftr = particles[i][2]; // Future position of particles.

        // Get the angle of movement from a noise calculation.
        var n = (noise(pos.x + frameCount), (pos.y + frameCount)) * TAU * 8;

        // Calculate the direction of movement.
        var dir = createVector(cos(n) / 2, -random(1) + 0.4);

        vel.add(dir);

        // Limit the velocity of particles.
        vel.lerp(0, 0, 0, 0.1);

        // Add our velocity to the future position of particles.
        ftr.add(vel);

        // Iterpolate towards the correct particles position.
        pos.lerp(ftr.x, ftr.y, 0, 0.1)

        // Wrap off screen positions.
        if (pos.x < -particleSize * 2) {
            pos.x = width + (particleSize * 2) - 1
            ftr.x = pos.x

        } else if (pos.x > width + (particleSize * 2)) {
            pos.x = (-particleSize * 2) + 1
            ftr.x = pos.x
        }

        // If the top of the screen is reached we reset the position and randomize x.
        if (pos.y < 0) {
            pos.x = random(width)
            pos.y = height + particleSize * 2
            ftr.x = pos.x
            ftr.y = pos.y
        }

        var distToMouse = mousePos.dist(pos); // Get the distance of the particle to the mouse cursor.

        // If the distance is shorter than minimum distance we apply force to the particle.
        if (distToMouse < particleDist) {
            var force = createVector(pos.x - mousePos.x, pos.y - mousePos.y);

            if (mouseIsPressed) {
                if (mouseButton == RIGHT) force.setMag(-distToMouse / (particleDist / 6));

            } else {
                force.setMag(distToMouse / (particleDist / 8));
            }

            ftr.add(force);
        }
    }
}

// Program entry point.
function setup() {
    // Create the canvas in the base page.
    canvas = createCanvas(windowWidth, windowHeight);

    // Get the correct parent by its ID.
    canvas.parent("canvas");

    // Set drawing defaults.
    frameRate(60);
    noStroke();

    // Set particle variables.
    particleMult = 0.75;
    particleSize = 6;
    particleDist = 64;
    particleSpeed = 1;

    createParticles(); // Create the particles with the set values.
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    createParticles(); // Recreate particles with the new screen settings.
}

// Called each frame.
function draw() {
    clear(); // Clear the last frame.

    drawParticles(); // Draw particles.
    updateParticles(); // Update particle logic.
}
