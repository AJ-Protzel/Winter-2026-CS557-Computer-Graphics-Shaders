# CS 557 — Computer Graphics Shaders

Graduate coursework for Oregon State University CS 557, Winter 2026. Eight GLSL shader projects, each written against the course's `glman` harness and a shared C++/OpenGL sample program.

Every project is a self-contained folder holding its shaders, the driver `sample.cpp`, and the assignment PDF.

## Projects

| # | Focus | Shaders |
|---|---|---|
| 1 | Per-fragment ADS lighting with an elliptical pattern and tolerance-based edge blending | `.vert` `.frag` |
| 2 | Elliptical pattern driven by adjustable diameters in *s* and *t* | `.frag` |
| 3 | **A** — lit surface pattern · **B** — the same surface displaced by 3D noise (amplitude/frequency) | `.vert` `.frag` |
| 4 | Refraction and reflection through a noise-perturbed surface, with an index-of-refraction and mix controls | `.vert` `.frag` + texture pair |
| 5 | "Magic Lens" — a 2D image texture magnified and whirled inside a movable radius | `.vert` `.frag` |
| 6 | Time-animated texture blended across a cylinder, with repeat and range controls | `.vert` `.frag` + `snake_skin.bmp` |
| 7 | Geometry shader work — lit geometry expanded at the primitive stage | `.vert` `.geom` `.frag` |
| 8 | Final project — a 32-step ray march with time-driven flow and a movable light | `.vert` `.frag` |

## Layout

```text
proj 1/ … proj 8/    per-project shaders, sample.cpp, assignment PDF
Main/                shared C++/OpenGL driver, GLUT/GLEW headers and libs, glm
```

## Building

These are course-harness projects: the shaders are written to be loaded by `glman`, with `Main/` holding the OpenGL driver and dependencies (GLUT, GLEW, glm). Open `Main/Sample.sln` in Visual Studio, or use `Main/Makefile`. The uniform variables in each `.frag` are the sliders the assignment expects you to drive.

`glm` is vendored under `Main/glm/` and is marked as a vendored path so it does not skew the repository's language statistics.
