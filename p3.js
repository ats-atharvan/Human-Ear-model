// A human ear model in Three.js to show the basic functioning of the auditory system. 
// Code implemented by Atharvan Srivastava

// necessary import statements
import * as three from "./CS559-Three/build/three.module.js";
import { OBJLoader } from "./CS559-Three/examples/jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./CS559-Three/examples/jsm/controls/OrbitControls.js";


const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera Position
camera.position.set(10, 0, 15);  
camera.lookAt(scene.position);   // Ensure the camera is facing the scene

const waveCamera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
waveCamera.position.set(0, 2, 5);  // Positioned to look forward from the wave

// Loading the ear pinna object
const objLoader = new OBJLoader()
objLoader.load('./ear.obj', function(object) {
    object.traverse( function (obj) {
        if (obj.isMesh){
            obj.material.color.set(0xF3C79A);
            obj.material.DoubleSide;
        }
        } );
    scene.add(object);
    object.position.set(-2.8, 0.1, -0.7);
    object.rotateY(-Math.PI/6);
    object.scale.set(0.3,0.3,0.3);
})

const controls = new OrbitControls( camera, renderer.domElement );


// Add lighting to the scene
const ambientLight = new three.AmbientLight(0xffffff, 0.8); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight(0xffffff, 0.8); // Directional light
directionalLight.position.set(1, 1, 1); // Proper light direction
scene.add(directionalLight);

// Ear canal with slight curve and proper positioning
const earCanalPoints = [];  // control points for the curved geometry
earCanalPoints.push(new three.Vector3(-2.5, 0.05, 0));  // Start point
earCanalPoints.push(new three.Vector3(0.7, -0.1, 0));  // Curve point
earCanalPoints.push(new three.Vector3(4, 0.3, 0));  // Curve point
earCanalPoints.push(new three.Vector3(6.43, -0.08, 0));  // End point

const earCanalCurve = new three.CatmullRomCurve3(earCanalPoints);  // Create a curve

const earCanalGeometry = new three.TubeGeometry(earCanalCurve, 32, 0.5, 32, false);  // Create the tube
const earCanalMaterial = new three.MeshStandardMaterial({ color: 0xffaa00});  // Material for ear canal
earCanalMaterial.side = three.BackSide;
const earCanal = new three.Mesh(earCanalGeometry, earCanalMaterial);

scene.add(earCanal);  // Add to the scene

// Middle ear cavity as a box geometry
const middleEarCavity = new three.Mesh(
    new three.CircleGeometry(1.3, 32),
    new three.MeshStandardMaterial({ color: 0x666666, transparent: true, opacity: 0.3 })
);
middleEarCavity.position.set(6.7, 0, -1.2);
scene.add(middleEarCavity);

// Eustachian tube as a cylinder geometry
const eustachianTube = new three.Mesh(
    new three.CylinderGeometry(0.26, 0.2, 4),
    new three.MeshStandardMaterial({ color: 0xffaa00, transparent: true, opacity: 6 })
);
eustachianTube.rotation.z = Math.PI / 7; // Rotate to align with the bottom of the middle ear
eustachianTube.position.set(8.45, -2.8, 0); // Position to connect with the middle ear cavity
scene.add(eustachianTube);

const eustachianTubeBlock = new three.Mesh(
    new three.BoxGeometry(0.5, 0.1, 0.2),
    new three.MeshStandardMaterial({ color: 0xff0000 })
);
eustachianTubeBlock.position.set(7.83, -1.4, 0.2);
eustachianTubeBlock.rotation.z = Math.PI / 7;
eustachianTubeBlock.visible = false;
scene.add(eustachianTubeBlock);

// Middle ear with tympanic membrane and ossicles structure
const tympanicMembraneOuter = new three.Mesh(
    new three.CircleGeometry(0.54, 32),
    new three.MeshStandardMaterial({ color: 0xffffff, transparent: true, side: three.DoubleSide })
);
tympanicMembraneOuter.position.set(6.64, -0.09, 0);  // Positioned at the end of the ear canal
tympanicMembraneOuter.rotateY(-3*Math.PI/8);
tympanicMembraneOuter.rotateX(Math.PI/24);
scene.add(tympanicMembraneOuter);

const tympanicMembraneInner = new three.Mesh(
    new three.CircleGeometry(0.54, 32),
    new three.MeshStandardMaterial({ color: 0xffffff, transparent: true, side: three.DoubleSide })
);
tympanicMembraneInner.position.set(6.6, -0.09, 0);  // Positioned at the end of the ear canal
tympanicMembraneInner.rotateY(-3*Math.PI/8);
tympanicMembraneInner.rotateX(Math.PI/24);
scene.add(tympanicMembraneInner);

const tympanicMembraneBulge = new three.Mesh(
    new three.SphereGeometry(0.5, 32, 16, 0, Math.PI/2, 0, Math.PI),
    new three.MeshStandardMaterial({ color: 0xffffff, transparent: true, side: three.DoubleSide })
);
tympanicMembraneBulge.position.set(6.65, -0.09, 0);  // Positioned at the end of the ear canal
tympanicMembraneBulge.rotateY(-3*Math.PI/8);
tympanicMembraneBulge.rotateX(Math.PI/24);
tympanicMembraneBulge.scale.set(1, 1, 0.2);  // Default scale
scene.add(tympanicMembraneBulge);

const malleus = new three.Mesh(
    new three.ConeGeometry(0.5, 0.45, 32),
    new three.MeshStandardMaterial({ color: 0xff0000 })
);
malleus.rotateZ(-3*Math.PI/7.5);  // Malleus represented as a cone

const incus = new three.Mesh(
    new three.CylinderGeometry(0.08, 0.1, 0.5, 32),
    new three.MeshStandardMaterial({ color: 0x00ff00 })
);  // Incus represented as a thin cylinder
incus.rotateZ(-3*Math.PI/8);

const stapes = new three.Mesh(
    new three.CylinderGeometry(0.055, 0.055, 0.56, 32),
    new three.MeshStandardMaterial({ color: 0x0000ff })
);  // Stapes represented as a smaller cylinder
stapes.rotateZ(-3*Math.PI/4);

malleus.position.set(7.05, 0.08, 0);  // Proper positioning
incus.position.set(7.43, 0.28, 0);  // Position after malleus
stapes.position.set(7.87, 0.15, 0);  // Position after incus

scene.add(malleus);
scene.add(incus);
scene.add(stapes);

/// Semicircular canals
const semicircularCanals = new three.Mesh(
    new three.TorusKnotGeometry(0.63, 0.08, 200, 8, 9, 12),
    new three.MeshStandardMaterial({ color: 0x00FFFF })
);
semicircularCanals.position.set(8.26, 1.06, -1);
semicircularCanals.scale.set(1.1, 1.3, 1);
semicircularCanals.rotateY(Math.PI/4);
scene.add(semicircularCanals);

// Create a cochlea with multiple spirals
const cochlea = new three.Group();

// Main spiral for the cochlea
const primarySpiral = new three.Mesh(
    new three.TorusKnotGeometry(0.6, 0.15, 200, 16, 10, 3), 
    new three.MeshStandardMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.7 })
);

// Adjust the position to align with the rest of the ear model
primarySpiral.position.set(8.65, 0, -1);
primarySpiral.scale.set(1.1, 1.1, 1.1);
primarySpiral.rotateZ(Math.PI / 2); // Correct the orientation
cochlea.add(primarySpiral);

// Add the cochlea group to the scene
scene.add(cochlea);

// Add wax particles based on the build-up value
const waxParticles = []; // Store references to wax particles

// Function to generate consistent random values based on a seed
function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x); // Keeping the fraction part for consistent randomness
}
// Function to generate random positions on the outer surface of the tube
function generateRandomPointOnTube(curve, index, offset, seed) {
    const randomValue = seededRandom(seed + index); // Generate a consistent random value based on the seed
    const t = randomValue; // Use the random value to determine the position on the curve

    const point = curve.getPoint(t); // Point on the curve
    const tangent = curve.getTangent(t).normalize(); // Tangent direction
    const perpendicular = new three.Vector3().crossVectors(tangent, new three.Vector3(0, -0.5, 1)).normalize(); // Perpendicular vector
    const normal = perpendicular.cross(tangent).normalize(); // Normal direction 
    return point.clone().add(perpendicular.multiplyScalar(offset));
    }

// Create and add wax particles to the scene
function createWaxParticles(waxBuildUp) {
    // Clear existing wax particles from the scene
    waxParticles.forEach((particle) => scene.remove(particle));
    waxParticles.length = 0;

    // Create new wax particles based on the build-up value
    for (let i = 0; i < waxBuildUp; i++) {
        const seed = i+9904866;
        const waxPosition = generateRandomPointOnTube(earCanalCurve, i, 0.25, seed); // Position on the surface
        const wax = new three.Mesh(
        new three.SphereGeometry(0.3), // Small sphere for wax particle
        new three.MeshStandardMaterial({ color: 0x964B00 }) // Brown color for wax
        );

        wax.position.copy(waxPosition); // Set position to the generated point
        waxParticles.push(wax); // Store the wax particle
        scene.add(wax); // Add the wax particle to the scene
    }
}


class MovingSineWave {
constructor(amplitude, frequency, speed, startPosition, endPosition) {
    this.amplitude = amplitude; // Base amplitude
    this.frequency = frequency; // Frequency of the sine wave
    this.speed = speed; // Speed of the wave
    this.position = startPosition; // Starting point
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.geometry = new three.BufferGeometry(); // Geometry for the sine wave
    this.material = new three.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 }); // Line material
    this.numPoints = 100; // Number of points in the sine wave
    this.fadeLength = 1; // Length of the fade at the end
}

update() {
    this.position += this.speed; // Move the wave to the right

    if (this.position > this.endPosition) {
    this.position = this.startPosition; // Reset to start from the left
    }

    const points = [];
    const totalLength = this.endPosition - this.startPosition;

    for (let i = 0; i < this.numPoints; i++) {
    const t = (i / (this.numPoints - 1)); // Fraction along the distance
    const x = this.position - totalLength + t * totalLength; // Adjust x-axis based on speed

    let y = 0.25 * 0.175 * this.amplitude * Math.sin(x * this.frequency); // Base waveform

    // Smooth fade-out near the tympanic membrane to avoid abrupt transitions
    if (x >= this.endPosition - this.fadeLength && x < this.endPosition) {
        const fadeFactor = 1 - (x - (this.endPosition - this.fadeLength)) / this.fadeLength;
        y *= fadeFactor; // Apply fading to smooth out the transition
    }

    points.push(new three.Vector3(x, y, 0)); // Add points to the wave
    }

    this.geometry.setFromPoints(points); // Update the geometry with the new points
}

getLine() {
    return new three.Line(this.geometry, this.material); // Return the line object
}
}


// Create a sine wave with starting and ending positions
const sineWave = new MovingSineWave(
1, // Initial amplitude
1, // Frequency
0.08, // Speed
-5, // Start position outside the pinna
7.2 // End position at the tympanic membrane
);

scene.add(sineWave.getLine()); 

function updateWaveCamera() {

    const waveGeometry = sineWave.getLine().geometry;
    const positions = waveGeometry.attributes.position.array;
    const numPoints = positions.length / 3;
    const lastIndex = numPoints - 1;

    if (lastIndex < 0) return; // No points to follow

    // Get the front of the wave
    const frontWavePosition = new three.Vector3(
        positions[3 * lastIndex],     // x
        positions[3 * lastIndex + 1], // y
        positions[3 * lastIndex + 2]  // z
    );

    // Set the camera's position at this front point
    camera.position.x = frontWavePosition.x; 
    camera.position.y = frontWavePosition.y; 
    camera.position.z = frontWavePosition.z; 
    
    // Point the camera in the direction the wave is moving
    // As the wave moves along the x-axis, we point the camera forward along this axis
    const lookAtPosition = new three.Vector3(frontWavePosition.x + 1, frontWavePosition.y, frontWavePosition.z);
    camera.lookAt(lookAtPosition);
}





// Wax build-up threshold above which sound intensity is reduced
const waxThreshold = 7;

// Function to determine the scaling factor based on wax build-up
function waxScalingFactor(waxValue) {
    if (waxValue > waxThreshold) {
        return 1 - (waxValue - waxThreshold) / 5.5; // Scale down proportionally after the threshold
    } else {
        return 1; // No scaling if wax build-up is below the threshold
    }
}

// Create a canvas for the warning message
const warningCanvas = document.createElement('canvas'); // Create a new canvas
warningCanvas.width = 512; 
warningCanvas.height = 128; 
const ctx = warningCanvas.getContext('2d'); // Get the canvas context

// Define text style and position
ctx.fillStyle = 'red'; // Text color
ctx.font = '40px Arial'; // font size
ctx.textAlign = 'center'; // Center the text horizontally

// Draw the warning message
ctx.fillText('Sound Intensity is too high!', warningCanvas.width / 2, warningCanvas.height / 2); 

// Create a texture from the canvas
const warningTexture = new three.CanvasTexture(warningCanvas); 
const warningMaterial = new three.SpriteMaterial({ map: warningTexture, transparent: true }); // Sprite material with texture

// Create a sprite to display the warning message
const warningSprite = new three.Sprite(warningMaterial); 
warningSprite.scale.set(10, 3, 1);
warningSprite.position.set(-2, 8, 0); // Position the warning above the scene

// Initially hide the warning message
warningSprite.visible = false; 

// Add the warning sprite to the scene
scene.add(warningSprite);

// Function to check if the warning should be visible based on sound intensity
function checkSoundIntensity() {
    if (soundIntensity.value > 6) {
        warningSprite.visible = true; // Show the warning if sound intensity is too high
    } else {
        warningSprite.visible = false; // Hide the warning otherwise
    }
}

// Function to create a label with a connecting line
function createLabelWithLine(labelText, labelPosition, earPosition) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; // Width for longer text
    canvas.height = 128; // Height for clarity

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; // Text color
    ctx.font = '40px Arial'; // Font size
    ctx.textAlign = 'center'; // Centered text
    ctx.fillText(labelText, canvas.width / 2, canvas.height / 2); // Centered text on canvas

    const texture = new three.CanvasTexture(canvas); // Create the texture from the canvas
    const spriteMaterial = new three.SpriteMaterial({ map: texture, transparent: true }); // Sprite material with texture

    const sprite = new three.Sprite(spriteMaterial);
    sprite.scale.set(6.3, 1.5, 1); // Scale for proper text display
    sprite.position.copy(labelPosition); // Position the label

    // Create a line connecting the label to the ear part
    const lineGeometry = new three.BufferGeometry().setFromPoints([earPosition, labelPosition]);
    const lineMaterial = new three.LineBasicMaterial({ color: 0xffffff }); // Line color

    const line = new three.Line(lineGeometry, lineMaterial); // Create the line
    scene.add(sprite); // Add the label sprite
    scene.add(line); // Add the connecting line

    return { sprite, line }; // Return the label and line
}


// Define the label positions and texts
const labelData = [
    { text: 'Tympanic membrane', labelPosition: new three.Vector3(3, 4, 0), earPosition: new three.Vector3(6.64, -0.1, 0) },
    { text: 'Malleus', labelPosition: new three.Vector3(6, 1.5, 0), earPosition: new three.Vector3(7.05, 0.08, 0) },
    { text: 'Incus', labelPosition: new three.Vector3(7, 2, 0), earPosition: new three.Vector3(7.43, 0.28, 0) },
    { text: 'Stapes', labelPosition: new three.Vector3(8, 3, 0), earPosition: new three.Vector3(7.87, 0.15, 0) },
    { text: 'Cochlea', labelPosition: new three.Vector3(11, 0.5, 0), earPosition: new three.Vector3(8.65, 0, -1) },
    { text: 'Semicircular canals', labelPosition: new three.Vector3(11, 2, 0), earPosition: new three.Vector3(8.26, 1.06, -1) },
    { text: 'Eustachian tube', labelPosition: new three.Vector3(11.5, -2, 0), earPosition: new three.Vector3(7.83, -1.4, 0.2) },
    { text: 'Ear canal', labelPosition: new three.Vector3(-1, 5.5, 0), earPosition: new three.Vector3(0.7, 0.4, 0) },
    { text: 'Pinna', labelPosition: new three.Vector3(-4, 7.5, 0), earPosition: new three.Vector3(-3.2, 2.8, -0.7) },
    { text: 'Outer Ear', labelPosition: new three.Vector3(-5, -7, 0), earPosition: new three.Vector3(-5, -7, 0) },
    { text: 'Middle Ear', labelPosition: new three.Vector3(4, -6, 0), earPosition: new three.Vector3(4, -6, 0) },
    { text: 'Inner Ear', labelPosition: new three.Vector3(10.5, -5, 0), earPosition: new three.Vector3(10.5, -5, 0) },
];

// Create an array to store the label sprites and lines
const labels = labelData.map((label) => createLabelWithLine(label.text, label.labelPosition, label.earPosition));

// Function to control label visibility in the animation loop
function updateLabelVisibility() {
    labels.forEach(({ sprite, line }) => {
        const visibility = showLabels.visible; // Check the checkbox value
        sprite.visible = visibility; // Set label visibility
        line.visible = visibility; // Set line visibility
    });
}

// Interactive sliders and GUI
const gui = new dat.GUI();
const soundIntensity = { value: 1 };  // Default sound intensity
gui.add(soundIntensity, 'value', 0.1, 10).name('Sound Intensity');  // Slider for sound intensity

const airPressure = { value: 3 };  // Default air pressure
gui.add(airPressure, 'value', -5, 10).name('Air Pressure');  // Slider for air pressure

const waxBuildUp = { value: 0 };  // Default wax build-up
gui.add(waxBuildUp, 'value', 0, 10).name('Wax Build-Up');  // Slider for wax build-up

const eustachianTubeBlocked = { blocked: false };  // Eustachian tube blockage checkbox
gui.add(eustachianTubeBlocked, 'blocked').name('Eustachian Tube Blocked');  // Checkbox for blockage

// dat.GUI setup for controlling visibility of labels
const showLabels = { visible: false }; // Default value
const labelVisibilityControl = gui.add(showLabels, 'visible').name('Show Labels'); // Add to GUI

const cameraSettings = { followWave: false };

gui.add(cameraSettings, 'followWave').name('Follow Sound Wave').onChange((value) => {
    if (value) {
        controls.object = waveCamera;  // Switch controls to wave camera
    } else {
        camera.position.set(10, 0, 15);
        controls.object = camera;  // Switch controls back to the main camera
    }
    controls.update();
});




// Animation loop with proper rendering
function animate() {

    updateLabelVisibility(); // Update label visibility based on GUI control

    // Simulate ossicle vibration
    const vibrate = Math.sin(Date.now() * 0.1) * 0.007;  // Vibration effect
    
    // Show or hide the warning message based on sound intensity
    checkSoundIntensity(); 
    
    // Get the scaling factor based on the wax build-up
    const waxScale = waxScalingFactor(waxBuildUp.value);

    if (Math.abs(airPressure.value) < 0.1) {  // If air pressure is very low, no vibration in oscilles
        malleus.position.set(7.05, 0.08, 0); 
        incus.position.set(7.43, 0.28, 0);  
        stapes.position.set(7.87, 0.15, 0);  
        tympanicMembraneOuter.position.set(6.64, -0.09, 0);
        tympanicMembraneInner.position.set(6.6, -0.09, 0);
    } else{
        malleus.position.x += vibrate;  // Malleus vibrates
        incus.position.x += vibrate;  // Incus vibrates
        stapes.position.x += vibrate;  // Stapes vibrates

        malleus.position.y += vibrate * soundIntensity.value * waxScale;  // Malleus vibrates
        incus.position.y += vibrate * soundIntensity.value * waxScale;  // Incus vibrates
        stapes.position.y += vibrate * soundIntensity.value* waxScale;  // Stapes vibrates

        tympanicMembraneInner.position.x += vibrate * soundIntensity.value * waxScale;  
        tympanicMembraneOuter.position.x += vibrate * soundIntensity.value * waxScale;  // vibrates the tympanic membrane
    }

    if(airPressure.value >= 7 && eustachianTubeBlocked.blocked){
        tympanicMembraneBulge.scale.set(1, 1, airPressure.value * -0.1/2.3);  // Adjust the bulge scale with air pressure
    }
    else if(airPressure.value <= -2 && eustachianTubeBlocked.blocked){
        tympanicMembraneBulge.scale.set(1, 1, 0.2+airPressure.value * -0.1);  // Adjust the bulge scale with air pressure
    }
    else{
        tympanicMembraneBulge.scale.set(1, 1, 0.2);
    }
    
    if (eustachianTubeBlocked.blocked) {
        eustachianTubeBlock.visible = true;  // Show the red block when the checkbox is checked
    } else {
        eustachianTubeBlock.visible = false;  // Hide it when not checked
    }
    createWaxParticles(waxBuildUp.value);
    
    // Check if air pressure is close to zero (a small range to account for rounding errors)
    if (Math.abs(airPressure.value) < 0.1) {  // If air pressure is very low, remove the wave
        sineWave.geometry.setFromPoints([]);  // Clear the wave geometry
    } else {
        sineWave.amplitude = soundIntensity.value * waxScale;
        sineWave.frequency = (soundIntensity.value / 1.5) * waxScale; // Adjust frequency based on sound intensity
        sineWave.update();  // Update the wave geometry
    }
    if (cameraSettings.followWave) {
        updateWaveCamera();
    }
    controls.update();
    renderer.render(scene, camera);  // Render the scene
    requestAnimationFrame(animate);
}

animate();  // Start the animation loop