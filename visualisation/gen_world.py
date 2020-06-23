# This is a simple Python script for generating the face_vertices array that
# describes the 3D world. The world would normally be generated dynamically,
# but I wanted to simplify the code for explaining 3D rendering as much as
# possible, so just have an array of static coordinates in the JS code,
# generated by this script.

cube_face_vertices = [
    [[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]],
    [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]],
    [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]],
    [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]],
]

pyramid_face_vertices = [
    [[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]],
    [[0, 0, 0], [0, 0, 1], [0.5, 1, 0.5]],
    [[0, 0, 1], [1, 0, 1], [0.5, 1, 0.5]],
    [[1, 0, 1], [1, 0, 0], [0.5, 1, 0.5]],
    [[1, 0, 0], [0, 0, 0], [0.5, 1, 0.5]]
]

cubes = [[-2, 0, 1], [1, 0, 1]]
pyramids = [[-0.5, 0, 4]]

face_vertices = []

for tx, ty, tz in cubes:
    for face in cube_face_vertices:
        face_vertices.append([[x + tx, y + ty, z + tz] for x, y, z in face])

for tx, ty, tz in pyramids:
    for face in pyramid_face_vertices:
        face_vertices.append([[x + tx, y + ty, z + tz] for x, y, z in face])


print('[')
for face in face_vertices:
    print(f'    {face},')

print(']')
