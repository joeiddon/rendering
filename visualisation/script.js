'use strict';

/*
 * Good fundamental resource: https://webglfundamentals.org/
 * Shaders are defined as strings in the `shaders.js` script.
 *
 * Ultimately WebGL is a 2d rasterization (fills pixels from vector graphic)
 * library, but the Graphics Library Shader Language (GLSL) has features
 * that make writing 3d engines easier. This includes things like matrix
 * operations, dot products, and options like CULL_FACE and DEPTH (Z) BUFFER.
 *
 * For good, clear definitions of buffers etc. see:
 * https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
 */

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl');
if (!gl) canvas.innerHTML = 'Oh no! WebGL is not supported.';

let game_canvas = document.getElementById('game-canvas');
let gl2 = game_canvas.getContext('webgl');

let program = misc.create_gl_program(gl, vertex_shader_src, fragment_shader_src);
let program2 = misc.create_gl_program(gl2, vertex_shader_src, fragment_shader_src);

//set the color we want to clear to
gl.clearColor(0.9, 0.9, 0.9, 1);
gl2.clearColor(0.9, 0.9, 0.9, 1);


gl.viewport(0, 0, canvas.width, canvas.height);
gl2.viewport(0, 0, canvas.width, canvas.height);

let a_position_loc = gl.getAttribLocation(program, 'a_position');
let a_color_loc = gl.getAttribLocation(program, 'a_color');
let u_matrix_loc = gl.getUniformLocation(program, 'u_matrix');
// if any locations are -1, that means they are not being used in the shaders,
// so compiler got rid of them

let a2_position_loc = gl2.getAttribLocation(program2, 'a_position');
let a2_color_loc = gl2.getAttribLocation(program2, 'a_color');
let u2_matrix_loc = gl2.getUniformLocation(program2, 'u_matrix');

gl.useProgram(program);
gl2.useProgram(program2);

gl.enableVertexAttribArray(a_position_loc);
gl.enableVertexAttribArray(a_color_loc);

gl2.enableVertexAttribArray(a_position_loc);
gl2.enableVertexAttribArray(a_color_loc);

// see gen_world.py for generation of these coordinates (could have dynamically
// generated them, but to save time, did beforehand)
let face_vertices = [
    [[-2, 0, 1], [-2, 0, 2], [-1, 0, 2], [-1, 0, 1]],
    [[-2, 1, 1], [-2, 1, 2], [-1, 1, 2], [-1, 1, 1]],
    [[-2, 0, 1], [-2, 0, 2], [-2, 1, 2], [-2, 1, 1]],
    [[-1, 0, 1], [-1, 0, 2], [-1, 1, 2], [-1, 1, 1]],
    [[-2, 0, 1], [-1, 0, 1], [-1, 1, 1], [-2, 1, 1]],
    [[-2, 0, 2], [-1, 0, 2], [-1, 1, 2], [-2, 1, 2]],

    [[1, 0, 1], [1, 0, 2], [2, 0, 2], [2, 0, 1]],
    [[1, 1, 1], [1, 1, 2], [2, 1, 2], [2, 1, 1]],
    [[1, 0, 1], [1, 0, 2], [1, 1, 2], [1, 1, 1]],
    [[2, 0, 1], [2, 0, 2], [2, 1, 2], [2, 1, 1]],
    [[1, 0, 1], [2, 0, 1], [2, 1, 1], [1, 1, 1]],
    [[1, 0, 2], [2, 0, 2], [2, 1, 2], [1, 1, 2]],

    [[-0.5, 0, 4], [-0.5, 0, 5], [0.5, 0, 5], [0.5, 0, 4]],
    [[-0.5, 0, 4], [-0.5, 0, 5], [0.0, 1, 4.5]],
    [[-0.5, 0, 5], [0.5, 0, 5], [0.0, 1, 4.5]],
    [[0.5, 0, 5], [0.5, 0, 4], [0.0, 1, 4.5]],
    [[0.5, 0, 4], [-0.5, 0, 4], [0.0, 1, 4.5]],
];

// source of colors: https://sashamaps.net/docs/tools/20-colors/
let face_colors = [
    [230, 25, 75],
    [60, 180, 75],
    [255, 225, 25],
    [67, 99, 216],
    [245, 130, 49],
    [145, 30, 180],

    [70, 240, 240],
    [240, 50, 230],
    [188, 246, 12],
    [250, 190, 190],
    [0, 128, 128],
    [230, 190, 255],

    [154, 99, 36],
    [0, 0, 0],
    [128, 0, 0],
    [0, 0, 117],
    [128, 128, 128],
];


let positions = face_vertices.map(function (face) {
    // since webgl only deals with triangles, split rectangles into two
    // triangles
    if (face.length == 4)
        return [face[0], face[1], face[2], face[0], face[3], face[2]].flat();
    return face.flat();
}).flat();

let colors = [];
for (let i = 0; i < face_colors.length; i++)
    for (let j = 0; j < (face_vertices[i].length == 4 ? 6 : 3); j++)
        colors.push(...face_colors[i].map(x=>x/0xff));

//add checkerboard
//let s = 1;
//for (let x = -5; x < 5; x += s) {
//    for (let z = -5; z < 5; z += s) {
//        positions.push(...[
//            [x, 0, z], [x+s, 0, z], [x+s, 0, z+s],
//            [x, 0, z], [x, 0, z+s], [x+s, 0, z+s]
//        ].flat());
//        for (let p = 0; p < 6; p ++)
//            colors.push(...(((x+z)/s)%2 ?
//                [1, 1, 1] :
//                [0, 0, 0]
//            ));
//    }
//}


let positions_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positions_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

let colors_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

let positions_buffer2 = gl2.createBuffer();
gl2.bindBuffer(gl2.ARRAY_BUFFER, positions_buffer2);
gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(positions), gl2.STATIC_DRAW);

let colors_buffer2 = gl2.createBuffer();
gl2.bindBuffer(gl2.ARRAY_BUFFER, colors_buffer2);
gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(colors), gl2.STATIC_DRAW);

// multiply_many function abbreviated from dragon code, see there for full
// description
let multiply_many = matrices => matrices.reduce((acc, cur) => m4.multiply(acc, cur), m4.identity());

let draw_camera = true;
let lines_buffer = gl.createBuffer();
let line_colors_buffer = gl.createBuffer();
let frustum_positions_buffer = gl.createBuffer();
let frustum_colors_buffer = gl.createBuffer();
function update_frustum() {
    /*
     * sets the lines_buffer and returns the number of line points (also sets
     * the line colors
     */

    // define the camera by its vertexes, at the origin, before transforming it
    // to the game_cam's position
    let camera_scale = 0.4;
    let camera = [
        [-1, -1, -3], [1, -1, -3], [ 1, 1, -3], [-1, 1, -3], //back face
        [-1, -1,  0], [1, -1,  0], [ 1, 1,  0], [-1, 1,  0], //front face
        [-1, -1,  1], [1, -1,  1], [ 1, 1,  1], [-1, 1,  1], //front square
    ].map(p => p.map(x => x * camera_scale));
    let guide_z = 10; //essentially z-far
    let guide_x, guide_y;
    if (projection == 'perspective') {
        guide_x = guide_z * Math.tan(fov/2);
        guide_y = guide_z * Math.tan(fov/2 / aspect);
    } else {
        guide_x = x_clip;
        guide_y = x_clip / aspect;
    }
    let camera_points = [
        ...camera,
        [0, 0, 0], //origin, for connecting lens to
        // the four guide ends
        [guide_x, guide_y, guide_z], [-guide_x, guide_y, guide_z],
        [-guide_x, -guide_y, guide_z], [guide_x, -guide_y, guide_z],
        // the four guide starts, only used in ortho mode
        [guide_x, guide_y, 0], [-guide_x, guide_y, 0],
        [-guide_x, -guide_y, 0], [guide_x, -guide_y, 0]
    ].map(p => m4.apply(
        multiply_many([
            m4.translation(...game_cam),
            m4.rotation_y(game_yaw),
            m4.rotation_x(-game_pitch),
            //[[k,0,0,0],[0,k,0,0],[0,0,k,0],[0,0,0,1]] no longer scale here as
            // guides would be mucked up
        ]),
        [...p, 1]
    ).slice(0,3));

    // the axes
    let lines = [
        -10,  0,  0, 10,  0,  0,
          0,-10,  0,  0, 10,  0,
          0,  0,-10,  0,  0, 10,
    ];

    // connect the camera points
    let camera_lines = [];
    if (draw_camera) camera_lines.push(...[
        [0, 1], [1, 2], [2, 3], [3, 0], //back face
        [4, 5], [5, 6], [6, 7], [7, 4], //front face
        [0, 4], [1, 5], [2, 6], [3, 7], //linking lines
        [8, 9], [9, 10], [10, 11], [11, 8], //front square
        [12, 8], [12, 9], [12, 10], [12, 11], //"lens"
    ]);
    if (display_frustum) camera_lines.push(...(
        projection == 'perspective' ?
        [[12, 13], [12, 14], [12, 15], [12, 16]] :
        [[13, 17], [14, 18], [15, 19], [16, 20]]
    ));

    camera_lines = camera_lines.map(x => x.map(i => camera_points[i]).flat()).flat();
    lines.push(...camera_lines.flat());

    let line_colors = [];
    for (let i = 0; i < lines.length / 3; i++)
        line_colors.push(0, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, lines_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, line_colors_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line_colors), gl.STATIC_DRAW);

    let frustum_positions = (projection == 'perspective' ? [
        [12, 13, 14], [12, 14, 15], [12, 16, 15], [12, 13, 16]
    ] : [
        [13, 14, 18], [13, 17, 18], [14, 15, 19], [14, 18, 19],
        [15, 16, 20], [15, 19, 20], [13, 16, 20], [13, 17, 20]
    ]).map(t => t.map(x => camera_points[x]).flat()).flat();

    let frustum_colors = [];
    for (let i = 0; i < frustum_positions.length / 3; i++)
        frustum_colors.push(0, 0, 0, 0.4); // grey color good for not skewing the colors of the cube

    gl.bindBuffer(gl.ARRAY_BUFFER, frustum_positions_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(frustum_positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, frustum_colors_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(frustum_colors), gl.STATIC_DRAW);

    return {num_lines: lines.length / 3, num_triangles: frustum_positions.length/ 3};
}

//clockwise triangles are back-facing, counter-clockwise are front-facing
//switch two verticies to easily flip direction a triangle is facing
//"cull face" feature means kill (don't render) back-facing triangles
//gl.enable(gl.CULL_FACE);

//enable the z-buffer (only drawn if z component LESS than that already there)
gl.enable(gl.DEPTH_TEST);
gl2.enable(gl2.DEPTH_TEST);

//alpha blending
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

function perspective_mat(fov, aspect, near, far){
    return [
        [ 1/Math.tan(fov/2),                      0,                     0,                     0],
        [                 0, aspect/Math.tan(fov/2),                     0,                     0],
        [                 0,                      0, (far+near)/(far-near), 2*near*far/(near-far)],
        [                 0,                      0,                     1,                     0]
    ];
}

function orthographic_mat(aspect, x_clip, near, far){
    // essentially same projection as perspective, but dont divide by z
    // the "orthographic box" is defined in the xy dimensions by x_clip (the
    // y-scale is calculated using aspect), and the clipping in the z is
    // defined by near and far. I.e. -x_clip <--> x_clip mapped to -1 <--> 1;
    // the corresponding for x_clip / aspect in y-direction and in the
    // z-direction, near <--> far mapped to -1 <--> 1
    return [
        [ 1/x_clip,             0,            0,  0],
        [      0, 1/x_clip*aspect,            0,  0],
        [      0,             0, 2/(far-near), -1],
        [      0,             0,            0,  1]
    ];
}

let fov = misc.deg_to_rad(50);
let near = 0.1; //closest z-coordinate to be rendered
let far = 1000; //furthest z-coordianted to be rendered
let aspect = canvas.width/canvas.height;
let m_perspective = perspective_mat(fov, aspect, near, far);

let x_clip = 3;

let cam = [0, 20, -20]; // issues when cam is up x-axis with panning of space_pitch !! - would be fixed by modifying space_yaw and space_pitch based on the current position of the cam

let game_cam = [0, 2, -5];
let game_yaw = 0;
let game_pitch = -0.2;

// space is the grid
let space_yaw = 1;
let space_pitch = 0;

// setup initial status for reset button
const init_setup = [space_yaw, space_pitch, game_cam.slice(0,3), game_yaw, game_pitch];
let reset = () => [space_yaw, space_pitch, game_cam, game_yaw, game_pitch] = init_setup;

let origin_game_cam = () => [game_cam, game_yaw, game_pitch] = [[0,0,0], 0, 0];

let matrices = {};

let projection = 'perspective';

function calculate_matrices(){
    // matrices in right-to-left order (i.e. in order of application)

    // rotates space according to space_yaw and space_pitch
    matrices.rot = m4.multiply(m4.rotation_x(space_pitch), m4.rotation_y(space_yaw));
    //transforms in front of cam's view
    matrices.view = m4.multiply(m4.inverse(m4.orient(cam, [0,0,0])), matrices.rot);
    //maps 3d to 2d
    matrices.world = m4.multiply(m_perspective, matrices.view);
}

let axis_marks = true;
let plot_points = false;
let show_cam_pos = false;

let last_labels = [];
function update_labels() {
    let points_to_plot = [
        [7, 7, 7], [-5, 5, 5], [8, 4, 0], [-10, 0, -10]
    ];
    let labels = [
        //['label text', [x, y, z], dot?]
        ['x', [10, 0, 0], false],
        ['y', [0, 10, 0], false],
        ['z', [0, 0, 10], false]
    ];
    if (plot_points) labels.push(...points_to_plot.map(p=>['('+p+')', p, true]));
    if (show_cam_pos) labels.push(
        ['('+game_cam.map(x=>x.toFixed(1)).toString()+')', game_cam, true]
    );
    let container = document.getElementById('labels-3d');

    // if the labels have changed from last time (in terms of definition), then
    // create all a fresh
    if (last_labels.length != labels.length ||
        !labels.every((l,i) => l[0] == last_labels[i][0]))
            container.innerHTML = '';
    last_labels = labels;

    if (!container.children.length) { // create fresh
        for (let label of labels) {
            let el = document.createElement('code');
            el.classList.add('label-3d');
            el.innerText = label[0];
            if (label[2]) { //add a dot in top left
                let dot = document.createElement('div');
                dot.classList.add('label-3d-point');
                el.appendChild(dot);
            }
            container.appendChild(el);
        }
    }
    for (let i = 0; i < container.children.length; i++) {
        let child = container.children[i];
        let label = labels[i];
        let tr = m4.apply(matrices.world, [...label[1], 1]);
        // divide by w component to get clipspace
        let cx = tr[0] / tr[3];
        let cy = tr[1] / tr[3];
        // convert clipspace to "canvas space"
        let x = (0.5 * cx + 0.5) * canvas.width;
        let y = (1-(0.5 * cy + 0.5)) * canvas.height;
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
            child.style.display = 'none'; //off the screen
        } else {
            child.style.display = 'block';
            // offset* is from positioned element, client* is witdth of border
            // add the offsetWidth/2 and offsetHeight/2 subs to get centered
            // rather than top left of element
            child.style.left = Math.floor(canvas.offsetLeft + canvas.clientLeft + x); //- child.offsetWidth/2);
            child.style.top = Math.floor(canvas.offsetTop + canvas.clientTop + y); // - child.offsetHeight/2);
        }
    }
}

let display_frustum = true;
let auto_spin = false;
let draw_world = true;

function update() {
    calculate_matrices();
    let frustum_counts = update_frustum();
    update_labels();

    if (auto_spin) space_yaw += 0.001;

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniformMatrix4fv(u_matrix_loc, false, m4.gl_format(matrices.world));

    // draw triangles
    if (draw_world) {
        gl.bindBuffer(gl.ARRAY_BUFFER, positions_buffer);
        gl.vertexAttribPointer(a_position_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer);
        gl.vertexAttribPointer(a_color_loc, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
    }

    // draw lines
    gl.bindBuffer(gl.ARRAY_BUFFER, lines_buffer);
    gl.vertexAttribPointer(a_position_loc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, line_colors_buffer);
    gl.vertexAttribPointer(a_color_loc, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, frustum_counts.num_lines);


    if (display_frustum) {
        //draw frustum triangles
        gl.depthMask(false); //disables writing to z buffer so all alpha are drawn
        gl.bindBuffer(gl.ARRAY_BUFFER, frustum_positions_buffer);
        gl.vertexAttribPointer(a_position_loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, frustum_colors_buffer);
        gl.vertexAttribPointer(a_color_loc, 4, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, frustum_counts.num_triangles);
        gl.depthMask(true);
    }

    // draw triangles to game canvas (no lines as cant be bothered)
    gl2.clear(gl2.COLOR_BUFFER_BIT);

    // calculate on-the-fly as settings (fov) may have changed
    let m_projection = projection == 'perspective' ?
        perspective_mat(fov, aspect, near, far) :
        orthographic_mat(aspect, x_clip, near, far);

    let game_matrix = multiply_many([
        m_projection,
        m4.rotation_x(game_pitch),
        m4.rotation_y(-game_yaw),
        m4.inverse(m4.translation(...game_cam))
    ]);

    gl2.uniformMatrix4fv(u2_matrix_loc, false, m4.gl_format(game_matrix));
    gl2.bindBuffer(gl2.ARRAY_BUFFER, positions_buffer2);
    gl2.vertexAttribPointer(a2_position_loc, 3, gl2.FLOAT, false, 0, 0);
    gl2.bindBuffer(gl2.ARRAY_BUFFER, colors_buffer2);
    gl2.vertexAttribPointer(a2_color_loc, 3, gl2.FLOAT, false, 0, 0);
    gl2.drawArrays(gl2.TRIANGLES, 0, positions.length / 3);

    requestAnimationFrame(update);
}

update();

function toclipspace(x, y) {
    return [
        (x / canvas.width) * 2 - 1,
        -((y / canvas.height) * 2 - 1),
    ];
}

canvas.addEventListener('mousemove', function(e) {
    if (e.buttons == 1) { //left button
        let sensitivity = 200;
        space_yaw -= e.movementX / sensitivity;
        space_pitch -= e.movementY / sensitivity;
        // whilst grabbing, turn off auto spin, but set event listener to turn
        // it back on when stopped grabbing (this will only be sent once, as on
        // future mousemove calls, auto_spin will be false from the first one)
        if (auto_spin) {
            auto_spin = false;
            canvas.addEventListener('mouseup', ()=>{auto_spin = true});
        }
    }
});

canvas.addEventListener('wheel', function(e) {
    //stops the whole window being scrolled
    e.preventDefault();
    cam = cam.map(c=>c * (1 + e.deltaY / 200));
});

game_canvas.addEventListener('click', e=>{game_canvas.requestPointerLock()});
game_canvas.addEventListener('mousemove', function(e) {
    if (document.pointerLockElement == game_canvas) {
        let sensitivity = 600;
        game_yaw += e.movementX / sensitivity;
        game_pitch -= e.movementY / sensitivity;
    }
});
let step_dist = 0.1;
let take_step = angle => {
    game_cam[0] += step_dist * Math.sin(game_yaw + angle);
    game_cam[2] += step_dist * Math.cos(game_yaw + angle);
};
// for this keydown to work, have to have tabindex on canvas
game_canvas.addEventListener('keydown', function(e) {
    let dirs = {'w': 0, 'a': -Math.PI/2, 's': Math.PI, 'd': Math.PI/2};
    if (dirs.hasOwnProperty(e.key)) take_step(dirs[e.key]);
    else if (e.key == 'z' || e.key == 'x') game_cam[1] += step_dist * (e.key == 'z' ? 1 : -1);
});

// make all options buttons work (onclick handlers defined in html)
for (let button of document.querySelectorAll('input[type=\'button\']')) {
    button.addEventListener('click', function() {
        if (this.classList.contains('toggle')) {
            if (this.classList.contains('pressed')) {
                this.classList.remove('pressed');
            } else {
                this.classList.add('pressed');
            }
        } else if (/flip-/.exec(this.className)) {
            let flip_name = /flip-[^\s]*/.exec(this.className)[0];
            for (let el of document.getElementsByClassName(flip_name)) {
                el.classList.remove('pressed');
            }
            this.classList.add('pressed');
        }
    });
}

document.getElementById('fov-range').nextElementSibling.innerText = parseInt(fov * 180 / Math.PI);
document.getElementById('x_clip-range').nextElementSibling.innerText = x_clip.toFixed(1);
