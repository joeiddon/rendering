Rendering
===
#### How a computer displays a 3D model on a screen.

This repository contains a collection of HTML/JS scripts to explain rendering
3D models to a 2D screen.

If you do not know how to code, you will probably most enjoy the [visualisation
tool](https://joeiddon.github.io/rendering/visualisation/), which allows you to
play with different 3D rendering concepts. For instance, the two common types
of projection: orthographic and perspective, and the idea of the viewing
frustum.

To follow the process of 3D rendering, either:

- Download the repository so you can run the code locally and edit the scripts.
- Read the source code by clicking on the links above, and view each revision
  by clicking on the links below.

### Source Code

Starting from `v1`, each script improves on the last. Comments are added to
explain the changes from the last script, so if you are confused by something
that isn't explained, look back at the version where it was added.

Version | Description / Improvement
--- | ---
[v1][1] | Laying out HTML/JS structure and how to draw a red triangle.
[v2][2] | World representation (face vertices and colors), and orthographic projection.
[v3][3] | Combining face vertex and color arrays into one object.
[v4][4] | Ordering faces by distance to centroid to prevent blocking.
[v5][5] | Upgrading to perspective projection.
[v6][6] | Controls to walk around the world (translation transformation).
[v7][7] | Adding looking around (rotation transformations).

[1]: https://joeiddon.github.io/rendering/v1.html
[2]: https://joeiddon.github.io/rendering/v2.html
[3]: https://joeiddon.github.io/rendering/v3.html
[4]: https://joeiddon.github.io/rendering/v4.html
[5]: https://joeiddon.github.io/rendering/v5.html
[6]: https://joeiddon.github.io/rendering/v6.html
[7]: https://joeiddon.github.io/rendering/v7.html

The source code for the [visualisation
tool](https://joeiddon.github.io/rendering/visualisation/), is under the
`/visualisation` directory. Note that this code was written using [the WebGL
rasterisation
engine](https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html),
and requires an understanding of 4x4 matrices to follow. I did not write this
code to be understood so it is quite messy in places. If you want to tackle it,
I recommend [this fundamentals guide](https://webglfundamentals.org/).
