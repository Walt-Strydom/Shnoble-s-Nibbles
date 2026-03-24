import random
import math

random.seed(42)

SIZE        = 780
CX, CY      = SIZE / 2, SIZE / 2
RING_R      = 255          # radius of peak dot density
SIGMA       = 72           # gaussian spread (controls ring thickness)
N_DOTS      = 14000        # total dots
DOT_COLOR   = "#777777"

dots = []
for _ in range(N_DOTS):
    theta = random.uniform(0, 2 * math.pi)

    # Radial position: gaussian around RING_R
    r = random.gauss(RING_R, SIGMA)
    if r < 0:
        continue

    x = CX + r * math.cos(theta)
    y = CY + r * math.sin(theta)

    # Clip to canvas
    if not (4 < x < SIZE - 4 and 4 < y < SIZE - 4):
        continue

    # Opacity: gaussian falloff from ring centerline
    dist = abs(r - RING_R)
    opacity = math.exp(-0.5 * (dist / SIGMA) ** 2)
    opacity *= random.uniform(0.25, 1.0)   # per-dot randomness
    opacity = round(min(max(opacity, 0), 1), 3)

    radius = random.uniform(0.6, 2.8)

    dots.append((x, y, radius, opacity))

# Build SVG
lines = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}" '
    f'width="{SIZE}" height="{SIZE}">',
    f'<g fill="{DOT_COLOR}">',
]
for x, y, r, op in dots:
    lines.append(
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" opacity="{op}"/>'
    )
lines += ["</g>", "</svg>"]

out_path = "assets/img/grain-ring.svg"
with open(out_path, "w") as f:
    f.write("\n".join(lines))

print(f"Generated {len(dots)} dots → {out_path}")
