"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Target, NotebookPen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import "katex/dist/katex.min.css";
import katex from "katex";

/**
 * Multivariable Calculus – Unit 1 Portfolio (Parametrics & Polar)
 * Front‑end heavy, interactive, rubric‑aligned.
 * - Content & Understanding: conceptual overview + 3 solved exemplars with steps, visuals, and checks
 * - Reflection & Metacognition: five thoughtful prompts completed
 * - Goal Setting: SMART goal for next unit
 * Tailwind + shadcn/ui + KaTeX. No external data.
 */

// ---------- math helpers ----------
function simpson(f: (x: number) => number, a: number, b: number, n = 20000) {
  if (n % 2 === 1) n++;
  const h = (b - a) / n;
  const s = f(a) + f(b);  // <-- const
  let s4 = 0;
  let s2 = 0;
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    if (i % 2 === 0) s2 += f(x);
    else s4 += f(x);
  }
  return (h / 3) * (s + 2 * s2 + 4 * s4);
}


function fmt(x: number, k = 4) {
  return Number.parseFloat(x.toFixed(k)).toString();
}

// ---------- math rendering components (replace react-katex) ----------

type MathProps = { math: string };

const MathInline = ({ math }: MathProps) => (
  <span dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { throwOnError: false }) }} />
);

const MathBlock = ({ math }: MathProps) => (
  <div className="my-2" dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { displayMode: true, throwOnError: false }) }} />
);

// ---------- small UI utilities ----------
const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
    <div className="grid gap-4">{children}</div>
  </div>
);

const ProblemCard = ({ title, children, tags = [] as string[] }: { title: string; children: React.ReactNode; tags?: string[] }) => (
  <Card className="border border-zinc-200/60 shadow-sm">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex gap-2">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
          ))}
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0 space-y-4">{children}</CardContent>
  </Card>
);

const Reveal = ({ label = "Show work", children }: { label?: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-zinc-800">{label}</span>
        <Button size="sm" variant={open ? "default" : "secondary"} onClick={() => setOpen((o) => !o)}>
          {open ? "Hide" : "Reveal"}
        </Button>
      </div>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
};

// ---------- tiny plot components ----------
function ParametricPlot({ f, t0, t1, samples = 600 }: { f: (t: number) => [number, number]; t0: number; t1: number; samples?: number }) {
  const pts = useMemo(() => {
    const arr: [number, number][] = [];
    for (let i = 0; i <= samples; i++) {
      const t = t0 + (i * (t1 - t0)) / samples;
      arr.push(f(t));
    }
    return arr;
  }, [f, t0, t1, samples]);

  // scale to viewBox
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const ymin = Math.min(...ys), ymax = Math.max(...ys);
  const pad = 1;
  const W = xmax - xmin || 1;
  const H = ymax - ymin || 1;

  const path = pts
    .map(([x, y], i) => {
      // map to 0..100 viewbox with y-flip
      const X = ((x - xmin) / W) * 100;
      const Y = (1 - (y - ymin) / H) * 100;
      return `${i === 0 ? "M" : "L"}${X},${Y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 100 100`} className="w-full h-60 rounded-xl bg-white border border-zinc-200">
      <rect x={0} y={0} width={100} height={100} rx={12} fill="white" />
      <path d={path} fill="none" strokeWidth={1.6} stroke="currentColor" className="text-blue-600" />
    </svg>
  );
}

export default function Unit1Portfolio() {
  // ---- Ellipse data ----
  const a = 6 / 5; // major radius on x
  const b = 1; // minor radius on y
  const c = Math.sqrt(11) / 5; // focal distance

  // ---- Polar area (one loop of r^2 = sin(2θ)) ----
  const polarAreaExact = 0.5;

  // ---- Parametric arc length ----
  const arcLen = useMemo(() => {
    const f = (t: number) => Math.sqrt(26 - 10 * Math.cos(t));
    return simpson(f, 0, 4 * Math.PI, 40000);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 p-6 sm:p-10">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Unit 1 Portfolio — Parametrics & Polar</h1>
          <p className="text-zinc-600 mt-2">Dean Mostafa • Multivariable Calculus • Parametric curves, polar coordinates, arc length, speed</p>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="content">Content & Understanding</TabsTrigger>
            <TabsTrigger value="reflection">Unit Reflection</TabsTrigger>
          </TabsList>

          {/* CONTENT TAB */}
          <TabsContent value="content">
            <Section title="Conceptual Overview" icon={<Sparkles className="w-6 h-6 text-blue-600" />}>
  <Card>
    <CardContent className="pt-6 space-y-3 leading-relaxed">
      <p>
  This unit shows curves as motion and as a choice of coordinates. With
  <span className="font-medium"> parametric equations</span>{" "}
  <MathInline math={"(x(t),\\,y(t))"} /> the parameter <MathInline math={"t"} /> acts like a
  clock that gives direction and <span className="font-medium">speed</span>{", "}
  <MathInline math={"v(t)=\\sqrt{(x'(t))^2+(y'(t))^2}"} />, turning
  <span className="font-medium"> arc length</span> into{" "}
  <MathInline math={"L=\\int_a^b v(t)\\,dt"} />. With
  <span className="font-medium"> polar equations</span>{" "}
  <MathInline math={"r=f(\\theta)"} />, symmetry is what influences bounds and area using{" "}
  <MathInline math={"A=\\tfrac12\\int r(\\theta)^2\\,d\\theta"} />. Across the examples
  (ellipse, lemniscate loop, cycloid), I practiced switching representations and choosing the
  one that makes the measurement simple, parametric for motion, polar for symmetry, and
  Cartesian when algebra is cleanest.
</p>

    </CardContent>
  </Card>
</Section>


            <Section title="Examples from WebAssign (Solved)" icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}>
              {/* Problem 1 */}
              <ProblemCard title="Ellipse: vertices, foci, and sketch" tags={["Conic via level set", "Parametric ↔ Cartesian"]}>
  <p className="leading-relaxed">
    Given <MathInline math={"25x^2 + 36y^2 = 36"} />, write the ellipse in standard form and find the vertices and foci.
  </p>
  <p className="text-zinc-700 italic">This example connects algebra (standard form) to geometry (axes, foci) and shows how parameters <MathInline math={"a,b,c"} /> affect the shape.</p>
  <Reveal>
    <MathBlock math={"\\frac{x^2}{36/25} + \\frac{y^2}{36/36} = 1 \\quad \\Rightarrow \\quad a^2 = \\tfrac{36}{25},\\; b^2 = 1"} />
    <p>Major axis is along the <span className="font-medium">x</span>-direction since <MathInline math={"a^2 > b^2"} />.</p>
    <MathBlock math={"a = \\tfrac{6}{5},\\; b = 1,\\; c^2 = a^2 - b^2 = \\tfrac{36}{25} - 1 = \\tfrac{11}{25} \\Rightarrow\\ c = \\tfrac{\\sqrt{11}}{5}"} />
    <div className="grid sm:grid-cols-2 gap-3">
      <Card className="bg-zinc-50">
        <CardContent className="pt-4">
          <MathBlock math={"\\text{Vertices: } (\\pm a, 0) = (\\pm \\tfrac{6}{5}, 0)"} />
          <MathBlock math={"\\text{Foci: } (\\pm c, 0) = (\\pm \\tfrac{\\sqrt{11}}{5}, 0)"} />
        </CardContent>
      </Card>
      <Card className="bg-zinc-50">
        <CardContent className="pt-4 text-sm text-zinc-700">
          <p>Parametric sketch (for reference):</p>
          <ParametricPlot f={(t) => [a * Math.cos(t), b * Math.sin(t)]} t0={0} t1={2 * Math.PI} samples={500}/>
        </CardContent>
      </Card>
    </div>
  </Reveal>
</ProblemCard>


              {/* Problem 2 */}
              <ProblemCard title="Polar area: r^2 = sin(2θ) (one loop)" tags={["Polar area", "Lemniscate"]}>
  <p>
    The shaded right-hand loop corresponds to <MathInline math={"0 \\le \\theta \\le \\tfrac{\\pi}{2}"} /> with{" "}
    <MathInline math={"r^2 = \\sin(2\\theta) \\ge 0"} />.
  </p>
  <p className="text-zinc-700 italic">
    Here I practice choosing correct <MathInline math={"\\theta"} /> bounds and using the polar area formula{" "}
    <MathInline math={"\\tfrac{1}{2}\\int r^2\\,d\\theta"} />.
  </p>

  <Reveal>
    <MathBlock
      math={String.raw`
\begin{aligned}
A &= \tfrac12 \int_{0}^{\pi/2} r^2\,d\theta
   = \tfrac12 \int_{0}^{\pi/2} \sin(2\theta)\,d\theta \\
  &= \tfrac12 \Big[ -\tfrac12 \cos(2\theta) \Big]_{0}^{\pi/2}
   = \tfrac12 \cdot \tfrac{\cos 0 - \cos \pi}{2}
   = \tfrac12
\end{aligned}
      `}
    />

    <div className="flex items-center gap-2">
      <Badge className="rounded-full">Exact area</Badge>
      <span className="font-semibold">A = 0.5</span>
    </div>
  </Reveal>
</ProblemCard>



              {/* Problem 3 */}
              <ProblemCard title="Arc length of a parametric curve" tags={["Speed", "Arc length integral"]}>
  <p>
    For <MathInline math={"x(t) = t - 5\\sin t,\\ y(t) = 1 - 5\\cos t,\\ 0 \\le t \\le 4\\pi"} />, set up and evaluate the length.
  </p>
  <Reveal>
    <MathBlock math={"x'(t) = 1 - 5\\cos t,\\quad y'(t) = 5\\sin t"} />
    <MathBlock math={"L = \\int_{0}^{4\\pi} \\sqrt{(x'(t))^2 + (y'(t))^2}\\,dt = \\int_{0}^{4\\pi} \\sqrt{(1 - 5\\cos t)^2 + (5\\sin t)^2}\\,dt"} />
    <MathBlock math={"= \\int_{0}^{4\\pi} \\sqrt{26 - 10\\cos t}\\,dt \\quad (\\text{since } \\cos^2 t + \\sin^2 t = 1)"} />

    <div className="grid sm:grid-cols-2 gap-3">
      <Card className="bg-zinc-50">
        <CardContent className="pt-4 space-y-2 text-sm">
          <p className="text-zinc-700">Numerical evaluation (numeric approximation):</p>
          <p className="text-lg font-semibold">L ≈ {fmt(arcLen, 4)}</p>
          <p className="text-zinc-600">(target from class key ≈ 63.4618)</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-50">
        <CardContent className="pt-4 text-sm text-zinc-700">
          <p>Shape of the curve over <MathInline math={"[0,4\\pi]"} />:</p>
          <ParametricPlot
            f={(t) => [t - 5 * Math.sin(t), 1 - 5 * Math.cos(t)]}
            t0={0}
            t1={4 * Math.PI}
            samples={800}
          />
        </CardContent>
      </Card>
    </div>
  </Reveal>
</ProblemCard>

            </Section>

            <Section title="Importance & Applications" icon={<Target className="w-6 h-6 text-purple-600" />}>
              <Card>
                <CardContent className="pt-6 space-y-3 leading-relaxed">
                  <ul className="list-disc ml-6 space-y-2">
                    <li>
                      <span className="font-medium">Physics/Engineering:</span> Arc length and speed power kinematics of robot arms and satellites; polar integrals compute masses and areas in non‑Cartesian geometry.
                    </li>
                    <li>
                      <span className="font-medium">Computer graphics:</span> Parametric curves (splines) define paths and strokes; arc length enables even texture spacing and motion at constant speed.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Section>

            <Section title="Making Connections" icon={<NotebookPen className="w-6 h-6 text-amber-600" />}>
              <Card>
                <CardContent className="pt-6 space-y-3 leading-relaxed">
                  <p>
                    Speed <MathInline math={"\\sqrt{(x')^2 + (y')^2}"} /> connects to the 3‑D magnitude of a velocity vector, preparing for space curves. The polar area
                    {" "}
                    <MathInline math={"\\tfrac{1}{2}\\int r^2 d\\theta"} /> directly comes from the single‑variable formula <MathInline math={"\\int y\\,dx"} /> for area, derived with infinitesimal sectors. Conic parameters
                    {" "}
                    (<MathInline math={"a, b, c"} /> with <MathInline math={"c^2 = a^2 - b^2"} />) connect algebraic forms to geometry and later to quadratic forms.
                  </p>
                </CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* REFLECTION TAB */}
          <TabsContent value="reflection">
  <Section title="Unit Reflection" icon={<NotebookPen className="w-6 h-6 text-rose-600" />}>
    <Card>
      <CardContent className="pt-6 space-y-5 leading-relaxed">
        <div>
          <p className="font-medium">1) Aha moment</p>
          <p>
  This unit was about thinking of a curve as motion, not just a picture. With
  {" "}<span className="font-medium">parametric equations</span>{" "}
  <MathInline math={"(x(t),\\,y(t))"} /> I started treating <em>t</em> like a clock, it tells me direction, where the curve speeds up or slows down, and when special moments like cusps or crossings happen. In contrast,
  {" "}<span className="font-medium">polar equations</span>{" "}
  <MathInline math={"r=f(\\theta)"} /> make symmetry jump out and force me to be careful about angle bounds so I trace a region exactly once. For motion I used the
  {" "}<span className="font-medium">speed</span> formula{" "}
  <MathInline math={"\\sqrt{(x'(t))^2+(y'(t))^2}"} /> and then turned that into
  {" "}<span className="font-medium"> arc length</span> with{" "}
  <MathInline math={"L=\\int v(t)\\,dt"} />. Across the ellipse, lemniscate, and cycloid examples, the big lesson was to switch coordinates to match the task, parametric when time and motion matter, polar when symmetry does, and plain Cartesian when the algebra is cleanest. That habit of picking the right viewpoint is what I’ll carry forward into our next topics.
</p>

        </div>

        <div>
          <p className="font-medium">2) Something I’m proud of</p>
          <p>
            For the arc-length problem I simplified the integrand to <MathInline math={"\\sqrt{26-10\\cos t}"} /> and
            then did a quick numerical check. I refined the step size once to make sure the value didn’t change much, and
            the final number matched the key to four decimals. It felt good to combine algebra, a sketch, and computation.
          </p>
        </div>

        <div>
          <p className="font-medium">3) A challenge</p>
          <p>
            Choosing bounds in polar coordinates took a couple tries. With <MathInline math={"r^2=\\sin(2\\theta)"} /> I
            first thought <MathInline math={"[-\\pi/4,\\pi/4]"} /> would work, but comparing to the picture and the sign
            of <MathInline math={"\\sin(2\\theta)"} /> nudged me to <MathInline math={"[0,\\pi/2]"} /> and to enforce
            {" "}<MathInline math={"r^2 \\ge 0"} /> so I didn’t double-count a lobe. A tiny quadrant sign chart helped.
          </p>
        </div>

        <div>
          <p className="font-medium">4) Growth this unit</p>
          <p>
            I got better at switching between coordinate systems and at writing short reasons under my answers (not just
            final numbers). I also started an error log (bounds, domains, missing absolute values) and a one-page “tool
            chooser” for when to use parametric vs. polar.
          </p>
        </div>

        <div>
          <p className="font-medium">5) Goal for next unit</p>
          <p>
            <span className="font-semibold">Goal:</span> On the day a problem set is assigned, I’ll finish
            <span className="font-semibold"> the first two problems that day</span> and add a quick 2-sentence concept
            check. I’ll track it in my notebook and ask one clarifying question before the next class.
            <em> Success:</em> 90% of sets follow this plan.
          </p>
        </div>
      </CardContent>
    </Card>

    <Card className="mt-4">
      <CardHeader><CardTitle className="text-base">Metacognitive notes (extra)</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p>
  Write bounds <em>before</em> the integral and annotate them (“right loop”):{" "}
  <MathInline math={"0\\le\\theta\\le\\pi/2"} /> since <MathInline math={"\\sin(2\\theta)\\ge 0"} /> in QI”).
</p>
        <p>For numeric checks: try a smaller step once and confirm the result barely changes.</p>
      </CardContent>
    </Card>
  </Section>
</TabsContent>


        </Tabs>
      </div>
    </div>
  );
}
