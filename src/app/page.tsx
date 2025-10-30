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


type MathProps = { math: string };

const MathInline = ({ math }: MathProps) => (
  <span dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { throwOnError: false }) }} />
);

const MathBlock = ({ math }: MathProps) => (
  <div className="my-2" dangerouslySetInnerHTML={{ __html: katex.renderToString(math, { displayMode: true, throwOnError: false }) }} />
);

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
  const a = 6 / 5; // major radius on x
  const b = 1; // minor radius on y
  const c = Math.sqrt(11) / 5; // focal distance

  const polarAreaExact = 0.5;

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
  During this unit, I came to understand that a curve is something I can write in more than one way, and to switch between different forms so that I can solve problems more efficiently. With parametric equations <MathInline math={"x(t)"} /> and <MathInline math={"y(t)"} />, I focus on how the coordinates change together but as their own individual relationship with a new variable.
  <br /><br />
  From <MathInline math={"x'(t)"} /> and <MathInline math={"y'(t)"} />, I can read the instantaneous speed <MathInline math={"v(t)=\\sqrt{(x'(t))^2+(y'(t))^2}"} />, which turns arc length into the equation: <MathInline math={"L=\\int v(t)\\,dt"} />, when thinking about it in a velocity and distance scenario. That equation was much more intuitive for me because it is calculating the area under the velocity vs time curve so the area represents some speed represented as distance/time, multiplied by the parametric variable, time, simplifying to just distance (d/t * t = d). That view makes the question of how far the path travelled much more intuitive and helped me explain where motion sped up or slowed down. I mention this same concept in my reflection.
  <br /><br />
  Polar equations <MathInline math={"r=f(\\theta)"} /> gave me the advantage of putting the angle in the front, so the symmetry shows up immediately, helping me choose bounds and not retracing the same part more than once by mistake. Area also fits nicely in this setting with <MathInline math={"A=\\tfrac{1}{2}\\int r(\\theta)^2\\,d\\theta"} />, so regions that would be awkward as an x-y relationship can be measured without converting back.
</p>





    </CardContent>
  </Card>
</Section>


            <Section title="Examples from WebAssign (Solved)" icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}>
              {/* Problem 1 */}
              <ProblemCard title="Ellipse: vertices, foci, and sketch">
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
              <ProblemCard title="Polar area: r^2 = sin(2θ) (one loop)">
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
              <ProblemCard title="Arc length of a parametric curve">
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

            <Section title="Importance & Applications (Paraphrased from Sources)" icon={<Target className="w-6 h-6 text-purple-600" />}>
  <Card>
    <CardContent className="pt-6 space-y-3 leading-relaxed">
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <span className="font-medium">Physics and Engineering:</span> Path length and speed show up in robot/vehicle motion planning, where 
          if you re-parameterize arc-length, it makes following a path smoother and timing much more aware
          (<a href="https://www.sciencedirect.com/science/article/abs/pii/S0957415821000404" target="_blank" rel="noreferrer" className="text-blue-600 underline">Wen et al., 2021</a>, 
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7363842/" target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">Ali et al., 2020</a>).
        </li>
        <li>
          <span className="font-medium">Computer Graphics and Animation:</span> Many systems use approximately arc-length-parameterized splines to move objects at visually constant speed and to space textures evenly 
          (<a href="https://homepage.divms.uiowa.edu/~kearney/pubs/CurvesAndSurfacesArcLength.pdf" target="_blank" rel="noreferrer" className="text-blue-600 underline">Wang & Kearney, 2003</a>; 
          <a href="https://developer.download.nvidia.com/video/siggraph/2020/presentations/sig03-polar-stroking-new-theory-and-methods-for-stroking-paths.pdf" target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">NVIDIA SIGGRAPH, 2020</a>).
        </li>
        <li>
          <span className="font-medium">Navigation and Radar:</span> Polar coordinates (range, angle) are the standard way to describe targets. Air-traffic and weather radar use a polar format before any map reprojection 
          (<a href="https://www.ebsco.com/research-starters/history/polar-coordinate-systems" target="_blank" rel="noreferrer" className="text-blue-600 underline">Research Starters</a>; 
          <a href="https://journals.ametsoc.org/view/journals/atot/33/3/jtech-d-15-0135_1.xml" target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">AMS Journal, 2016</a>).
        </li>
      </ul>
    </CardContent>
  </Card>
</Section>


            <Section title="Making Connections" icon={<NotebookPen className="w-6 h-6 text-amber-600" />}>
  <Card>
    <CardContent className="pt-6 space-y-3 leading-relaxed">
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <span className="font-medium">Speed = Pythagorean again:</span>{" "}
          <MathInline math={"\\sqrt{(x'(t))^2+(y'(t))^2}"} /> is just the distance formula for tiny
          steps <MathInline math={"(dx,dy)"} />. It’s the same idea as
          single-variable arc length <MathInline math={"L=\\int\\sqrt{1+(y')^2}\\,dx"} /> when
          x is the the parameter.
        </li>
        <li>
          <span className="font-medium">Parametric ↔ Cartesian via trig:</span>{" "}
          From <MathInline math={"x=\\cos t,\\ y=\\sin t"} /> we get
          {" "}<MathInline math={"x^2+y^2=1"} /> using <MathInline math={"\\sin^2 t+\\cos^2 t=1"} />.
          Taking away the parameter is basically solving a system plus a trig identity.
        </li>
      </ul>
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
  My big takeaway this unit was learning to see a curve as motion. With parametric equations <MathInline math={"(x(t),\\ y(t))"} />, I saw how a point moves as <MathInline math={"t"} /> changes, also being able to calculate both slope and speed directly. The slope is <MathInline math={"\\dfrac{dy}{dx}=\\dfrac{y'(t)}{x'(t)}"} /> and the speed is <MathInline math={"v(t)=\\sqrt{(x'(t))^2+(y'(t))^2}"} />. That distance along the path turns into the arc-length integral <MathInline math={"L=\\int v(t)\\,dt"} />, which feels natural for me because it is &quot;area under the speed vs. time graph,&quot; so thinking about that with dimensional analysis, the area would be meters per second multiplied by seconds so it is clear that the result unit is meters, or the arc-length. For me, with polar equations <MathInline math={"r=f(\\theta)"} />, the symmetry appears right away, so I’m more careful about the angle bounds and not retracing by accident if I set a bound incorrectly. Area also fits well as <MathInline math={"A=\\tfrac{1}{2}\\int r(\\theta)^2\\,d\\theta"} />. On the problems we solved, I practiced switching representations/viewpoints. When I needed speed, slope, or length I used a normal parametric, when the region was naturally radial I used polar, and just Cartesian when it seemed like the Algebra would be the shortest. Learning the habit of choosing the coordinate system first and then trying the problem made my work clearer. It also helped me explain where motion might speed up, slow down, or change direction, it is a habit I hope to bring to our later units.
</p>




        </div>

        <div>
          <p className="font-medium">2) Something I’m proud of</p>
          <p>
  I’m proud of how I explained and added to my answers as I solved problems, not just whether or not my final answer was correct. For arc length I wrote <MathInline math={"L=\\int v(t)\\,dt"} /> and then said what that value represents and the units. For slope I used <MathInline math={"\\dfrac{dy}{dx}=\\dfrac{y'(t)}{x'(t)}"} /> and noted what a positive or negative value at that spot would tell me. For polar area I used <MathInline math={"A=\\tfrac{1}{2}\\int r(\\theta)^2\\,d\\theta"} /> and drew the direction of <MathInline math={"\\theta"} /> so the region I was measuring was more clear to me. These habits of adding to my solutions made my work easier to read and helped me catch issues like retracing or mixed units before I fully committed to working the problem out, taking time while I was doing them but overall saving me from confusion and wasting time tracking down where I messed up.
</p>







        </div>

        <div>
          <p className="font-medium">3) A challenge</p>
          <p>
  Choosing bounds in polar coordinates took me a couple tries when I was first introduced. With <MathInline math={"r^2=\\sin(2\\theta)"} /> I first thought <MathInline math={"[-\\pi/4,\\,\\pi/4]"} /> would work, but comparing to the picture and the sign of <MathInline math={"\\sin(2\\theta)"} /> brought me to <MathInline math={"[0,\\,\\pi/2]"} /> and to enforce <MathInline math={"r^2>0"} /> so I didn’t recount a lobe. A quadrant sign chart helped.
</p>

        </div>

        <div>
          <p className="font-medium">4) Growth this unit</p>
          <p>
  I got better at switching between coordinate systems and at writing short reasons under my answers as opposed to just final numbers. In the past, I was much more cocky doing problems and did not appreciate the learning I gained by taking them slowly and dealing with the concepts in my head for longer, this unit I felt things &quot;click&quot; much more frequently than in past topics in other math classes.
</p>

        </div>

        <div>
          <p className="font-medium">5) Goal for next unit</p>
          <p>
  Goal: On the day a new WebAssign is assigned, I will take two problems I find myself to be the least confident with and write a 2-sentence concept check in my notebook. I&apos;ll write a clarifying question underneath to help my thinking. Success: 90% of WebAssign&apos;s follow this plan.
</p>

        </div>
      </CardContent>
    </Card>

    <Card className="mt-4">
  <CardHeader>
    <CardTitle className="text-base">Metacognitive notes (extra)</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    <ul className="list-disc ml-6 space-y-1">
      <li>Write bounds first and say why. Example: right loop: <MathInline math={"0\\le \\theta\\le \\pi/2"} /> since <MathInline math={"\\sin(2\\theta)\\ge 0"} />.</li>
      <li>At the top, label the coordinate choice (Parametric / Polar / Cartesian) and the answer’s units if applicable.</li>
    </ul>
  </CardContent>
</Card>

  </Section>
</TabsContent>


        </Tabs>
      </div>
    </div>
  );
}
