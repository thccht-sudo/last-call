# Builds the fighters' bodies in Blender (headless: the `bpy` module) and writes them as JSON
# skinned meshes for src/figure.ts. Run: python tools/build-characters.py src/anim/bodies.json
#
# Each body is modelled as clay: metaball capsules and ellipsoids per clothing layer (shirt,
# sleeves, hands, neck, trousers, shoes), meshed, decimated and smoothed. Layers overlap, so the
# seams between cloth and skin are clean intersections. Every vertex is weighted to the bones of
# a 14-bone skeleton laid along the same 18 joints the mocap drives, so the game skins the mesh
# straight from joint positions. Coordinates: metres, y up, facing +z, the character's left on +x.
import bpy, bmesh, json, math, sys
from mathutils import Vector, Quaternion

OUT = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else (sys.argv[1] if len(sys.argv) > 1 else 'bodies.json')

# Bind pose: a relaxed A-pose with the mocap actors' bone lengths.
def a_pose():
    j = {}
    j['Hips'] = (0, 0.95, 0); j['Chest'] = (0, 1.22, 0.005); j['Neck'] = (0, 1.40, 0.01); j['Head'] = (0, 1.47, 0.01)
    for s, side in ((1, 'L'), (-1, 'R')):
        sh = Vector((0.112 * s, 1.37, 0))
        up = Vector((math.sin(math.radians(40)) * s, -math.cos(math.radians(40)), 0.05)).normalized()
        el = sh + up * 0.266
        fo = Vector((math.sin(math.radians(30)) * s, -math.cos(math.radians(30)), 0.25)).normalized()
        ha = el + fo * 0.245
        hip = Vector((0.071 * s, 0.926, 0))
        kn = hip + Vector((0.05 * s, -0.425, 0.02))
        ft = kn + Vector((0.02 * s, -0.449, -0.03))
        toe = ft + Vector((0.01 * s, -0.06, 0.115))
        j['Sh' + side], j['El' + side], j['Hand' + side] = sh[:], el[:], ha[:]
        j['Hip' + side], j['Knee' + side], j['Foot' + side], j['Toe' + side] = hip[:], kn[:], ft[:], toe[:]
    return {k: Vector(v) for k, v in j.items()}

ORDER = ['Hips', 'Chest', 'Neck', 'Head', 'ShL', 'ElL', 'HandL', 'ShR', 'ElR', 'HandR',
         'HipL', 'KneeL', 'FootL', 'HipR', 'KneeR', 'FootR', 'ToeL', 'ToeR']

# Bones: head joint, tail joint, and the joints whose difference gives the bone's sideways axis.
BONES = [
    ('spine', 'Hips', 'Chest', ('HipL', 'HipR')),
    ('chest', 'Chest', 'Neck', ('ShL', 'ShR')),
    ('neck', 'Neck', 'Head', ('ShL', 'ShR')),
    ('upperArmL', 'ShL', 'ElL', None), ('foreArmL', 'ElL', 'HandL', None),
    ('upperArmR', 'ShR', 'ElR', None), ('foreArmR', 'ElR', 'HandR', None),
    ('thighL', 'HipL', 'KneeL', None), ('shinL', 'KneeL', 'FootL', None), ('footL', 'FootL', 'ToeL', ('HipL', 'HipR')),
    ('thighR', 'HipR', 'KneeR', None), ('shinR', 'KneeR', 'FootR', None), ('footR', 'FootR', 'ToeR', ('HipL', 'HipR')),
]
BI = {b[0]: i for i, b in enumerate(BONES)}

def to_bl(v): return Vector((v.x, -v.z, v.y))  # game (x, y up, z fwd) -> Blender (x, y fwd=-z?, z up)
def from_bl(v): return Vector((v.x, v.z, -v.y))

def clear():
    for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
    for m in list(bpy.data.metaballs): bpy.data.metaballs.remove(m)
    for m in list(bpy.data.meshes): bpy.data.meshes.remove(m)

def ball_mesh(name, elems, res=0.014, ratio=0.35):
    """elems: list of (kind, a, b|None, radius, scale(x,y,z)) in game coords. Returns a mesh object."""
    mb = bpy.data.metaballs.new(name)
    mb.resolution = res; mb.render_resolution = res; mb.threshold = 0.6
    k = 1.32  # metaball surfaces sit inside their radii; this brings them out to the sizes given
    obj = bpy.data.objects.new(name, mb)
    bpy.context.scene.collection.objects.link(obj)
    for kind, a, b, r, sc in elems:
        el = mb.elements.new()
        el.radius = r * k
        A = to_bl(a)
        if kind == 'capsule':
            B = to_bl(b)
            el.type = 'CAPSULE'
            el.co = (A + B) / 2
            d = B - A
            el.size_x = d.length / 2
            el.rotation = Vector((1, 0, 0)).rotation_difference(d.normalized())
        else:
            el.type = 'ELLIPSOID'
            el.co = A
            el.size_x, el.size_y, el.size_z = sc[0], sc[2], sc[1]  # game z (depth) is Blender y
        el.stiffness = 2.0
    dg = bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev)
    out = bpy.data.objects.new(name + '_mesh', me)
    bpy.context.scene.collection.objects.link(out)
    bpy.data.objects.remove(obj, do_unlink=True)
    dec = out.modifiers.new('dec', 'DECIMATE'); dec.ratio = ratio
    sm = out.modifiers.new('smooth', 'SMOOTH'); sm.factor = 0.5; sm.iterations = 2
    dg = bpy.context.evaluated_depsgraph_get()
    final = bpy.data.meshes.new_from_object(out.evaluated_get(dg))
    bpy.data.objects.remove(out, do_unlink=True)
    bm = bmesh.new(); bm.from_mesh(final)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(final); bm.free()
    return final

def seg_dist(p, a, b):
    ab = b - a; t = max(0.0, min(1.0, (p - a).dot(ab) / max(1e-9, ab.dot(ab))))
    return (p - (a + ab * t)).length

def weights(p, J, allowed, power=7.0):
    ws = []
    for name in allowed:
        _, a, b, _ = BONES[BI[name]]
        d = seg_dist(p, J[a], J[b])
        ws.append((1.0 / (d + 0.015) ** power, BI[name]))
    ws.sort(reverse=True)
    ws = ws[:4]
    s = sum(w for w, _ in ws)
    ws = [(w / s, i) for w, i in ws]
    while len(ws) < 4: ws.append((0.0, 0))
    return ws

def export_part(me, J, allowed, rigid=None):
    me.calc_loop_triangles()
    pos, nrm, idx, si, sw = [], [], [], [], []
    for v in me.vertices:
        p = from_bl(v.co); n = from_bl(v.normal)
        pos += [round(p.x, 3), round(p.y, 3), round(p.z, 3)]
        nrm += [round(n.x, 2), round(n.y, 2), round(n.z, 2)]
        ws = [(1.0, BI[rigid]), (0, 0), (0, 0), (0, 0)] if rigid else weights(p, J, allowed)
        si += [i for _, i in ws]; sw += [round(w, 2) for w, _ in ws]
    for t in me.loop_triangles:
        a, b, c = t.vertices
        idx += [a, c, b] if False else [a, b, c]
    return {'position': pos, 'normal': nrm, 'index': idx, 'skinIndex': si, 'skinWeight': sw}

def body(J, build):
    """build: dict of proportion knobs."""
    W, G, H, L = build['width'], build['girth'], build['hands'], build['legs']
    parts = {}
    c = lambda a, b, r: ('capsule', J[a] if isinstance(a, str) else a, J[b] if isinstance(b, str) else b, r, None)
    e = lambda at, sx, sy, sz, r=0.1: ('ellipsoid', at, None, r, (sx, sy, sz))
    mid = lambda a, b, t: J[a].lerp(J[b], t)
    shirt = [
        e(mid('Hips', 'Chest', 0.25) + Vector((0, 0, 0.0)), 1.28 * G, 1.0, 0.95 * G, 0.135),
        e(mid('Hips', 'Chest', 0.75), 1.4 * W, 1.0, 0.95, 0.14),
        e(mid('Chest', 'Neck', 0.4) + Vector((0, 0, 0.005)), 1.75 * W, 0.95, 0.85, 0.135),
        c('ShL', 'ElL', 0.072 * W), c('ShR', 'ElR', 0.072 * W),
        ('ellipsoid', J['ShL'] + Vector((0.04 * W, -0.01, 0)), None, 0.095 * W, (1, 1, 1)),
        ('ellipsoid', J['ShR'] + Vector((-0.04 * W, -0.01, 0)), None, 0.095 * W, (1, 1, 1)),
    ]
    if G > 1.1:  # a gut
        shirt.append(e(mid('Hips', 'Chest', 0.35) + Vector((0, 0, 0.04)), 1.2 * G, 1.0, 1.0 * G, 0.14))
    parts['shirt'] = (ball_mesh('shirt', shirt, ratio=0.3), ['spine', 'chest', 'upperArmL', 'upperArmR'], None)
    parts['sleeveL'] = (ball_mesh('sleeveL', [c('ElL', mid('ElL', 'HandL', 0.92), 0.052 * W)], ratio=0.4), ['foreArmL', 'upperArmL'], None)
    parts['sleeveR'] = (ball_mesh('sleeveR', [c('ElR', mid('ElR', 'HandR', 0.92), 0.052 * W)], ratio=0.4), ['foreArmR', 'upperArmR'], None)
    for s in 'LR':
        d = (J['Hand' + s] - J['El' + s]).normalized()
        fist = J['Hand' + s] + d * 0.065 * H
        parts['hand' + s] = (ball_mesh('hand' + s, [('ellipsoid', fist, None, 0.08 * H, (0.85, 0.85, 1.0)),
                                                     c('Hand' + s, fist, 0.045 * H)], ratio=0.5), None, 'foreArm' + s)
    parts['neck'] = (ball_mesh('neck', [c(mid('Chest', 'Neck', 0.6), 'Head', 0.058 * W)], ratio=0.5), ['neck', 'chest'], None)
    # Trousers: the seat, then each leg on its own so the legs never fuse into a skirt.
    seat = [e(J['Hips'] + Vector((0, -0.01, -0.005)), 1.4 * G, 0.75, 1.0 * G, 0.12)]
    for s in 'LR':
        seat.append(c(J['Hips'] + Vector((0.06 if s == 'L' else -0.06, -0.05, 0)), mid('Hip' + s, 'Knee' + s, 0.25), 0.085 * L))
    parts['pants'] = (ball_mesh('pants', seat, ratio=0.3), ['spine', 'thighL', 'thighR'], None)
    for s in 'LR':
        leg = [c(mid('Hip' + s, 'Knee' + s, 0.1), 'Knee' + s, 0.085 * L), c('Knee' + s, mid('Knee' + s, 'Foot' + s, 0.88), 0.068 * L),
               ('ellipsoid', mid('Hip' + s, 'Knee' + s, 0.35), None, 0.095 * L, (1.0, 1.3, 1.0))]
        parts['leg' + s] = (ball_mesh('leg' + s, leg, ratio=0.35), ['thigh' + s, 'shin' + s, 'spine'], None)
    for s in 'LR':
        heel = J['Foot' + s] + Vector((0, -0.045, -0.035))
        toe = J['Toe' + s] + Vector((0, 0.03, 0.01))
        parts['shoe' + s] = (ball_mesh('shoe' + s, [c(heel, toe, 0.052), ('ellipsoid', J['Foot' + s] + Vector((0, -0.02, 0)), None, 0.06, (1, 1, 1))], ratio=0.5), None, 'foot' + s)
    out = {}
    for name, (me, allowed, rigid) in parts.items():
        out[name] = export_part(me, J, allowed, rigid)
        print(name, len(me.vertices), 'verts', len(me.polygons), 'tris')
    return out

clear()
J = a_pose()
BUILDS = {
    'regular': {'width': 1.0, 'girth': 1.0, 'hands': 1.0, 'legs': 1.0},
    'heavy': {'width': 1.18, 'girth': 1.3, 'hands': 1.15, 'legs': 1.15},
    'lean': {'width': 0.92, 'girth': 0.9, 'hands': 0.95, 'legs': 0.92},
}
data = {
    'source': 'tools/build-characters.py (Blender %s)' % bpy.app.version_string,
    'joints': [[round(c, 4) for c in J[k]] for k in ORDER],
    'jointNames': ORDER,
    'bones': [{'name': n, 'from': ORDER.index(a), 'to': ORDER.index(b), 'side': [ORDER.index(s[0]), ORDER.index(s[1])] if s else None} for n, a, b, s in BONES],
    'builds': {k: body(J, v) for k, v in BUILDS.items()},
}
with open(OUT, 'w') as f: json.dump(data, f, separators=(',', ':'))
print('wrote', OUT)
