const s = scrollama();
let ow = 1320;
let oh = 760;
let m = { top: 140, right: 60, bottom: 80, left: 430 };
let w = ow - m.left - m.right;
let h = oh - m.top - m.bottom;
const pc = {
    DEMOCRAT: "#2b6cb0",
    REPUBLICAN: "#c53030"
};
const rc = {
    Northeast: "#7c3aed",
    Midwest: "#d97706",
    South: "#059669",
    West: "#2563eb"
};
const ss = d3.selectAll(".step");
const tip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");
function getLayout() {
    const vw = Math.max(window.innerWidth, 360);
    const vh = Math.max(window.innerHeight, 640);
    const left = 430;
    const right = 60;
    const top = 140;
    const bottom = 80;
    const outerWidth = vw;
    const outerHeight = Math.max(640, vh);
    const innerWidth = Math.max(260, outerWidth - left - right);
    const innerHeight = Math.max(360, outerHeight - top - bottom);
    return {
        ow: outerWidth,
        oh: outerHeight,
        m: { top: top, right: right, bottom: bottom, left: left },
        w: innerWidth,
        h: innerHeight
    };
}
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", ow)
    .attr("height", oh)
    .attr("viewBox", `0 0 ${ow} ${oh}`);
const g = svg.append("g")
    .attr("transform", `translate(${m.left},${m.top})`);
const a0 = g.append("g").attr("class", "chart-group");
const a1 = g.append("g").attr("class", "chart-group");
const a2 = g.append("g").attr("class", "chart-group");
const a3 = g.append("g").attr("class", "chart-group");
let now = 0;
function setLayout() {
    const layout = getLayout();
    ow = layout.ow;
    oh = layout.oh;
    m = layout.m;
    w = layout.w;
    h = layout.h;
    svg
        .attr("width", ow)
        .attr("height", oh)
        .attr("viewBox", `0 0 ${ow} ${oh}`);
    g.attr("transform", `translate(${m.left},${m.top})`);
}
setLayout();
function do0() {
    a0.selectAll("*").remove();
    const z = electionStoryData.national;
    const x = d3.scaleLinear()
        .domain(d3.extent(z, function(d) { return d.year; }))
        .range([0, w]);
    const y = d3.scaleLinear()
        .domain([40, 60])
        .range([h, 0]);
    a0.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks(5).tickSize(-w).tickFormat(""));
    a0.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(x).tickValues(z.map(function(d) { return d.year; })).tickFormat(d3.format("d")));
    a0.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return d + "%"; }));
    a0.append("text")
        .attr("class", "axis-label")
        .attr("x", w / 2)
        .attr("y", h + 52)
        .attr("text-anchor", "middle")
        .text("Election year");
    a0.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", -58)
        .attr("text-anchor", "middle")
        .text("National two-party vote share");
    const l1 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.demShare); })
        .curve(d3.curveMonotoneX);
    const l2 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.repShare); })
        .curve(d3.curveMonotoneX);
    const p1 = a0.append("path")
        .datum(z)
        .attr("class", "line-dem")
        .attr("d", l1);
    const p2 = a0.append("path")
        .datum(z)
        .attr("class", "line-rep")
        .attr("d", l2);
    [p1, p2].forEach(function(q) {
        const len = q.node().getTotalLength();
        q
            .attr("stroke-dasharray", len + " " + len)
            .attr("stroke-dashoffset", len)
            .transition()
            .duration(900)
            .attr("stroke-dashoffset", 0);
    });
    const c1 = a0.selectAll(".dem-point")
        .data(z)
        .enter()
        .append("circle")
        .attr("class", "line-point dem-point")
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.demShare); })
        .attr("r", 0)
        .attr("fill", pc.DEMOCRAT);
    const c2 = a0.selectAll(".rep-point")
        .data(z)
        .enter()
        .append("circle")
        .attr("class", "line-point rep-point")
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.repShare); })
        .attr("r", 0)
        .attr("fill", pc.REPUBLICAN);
    c1.transition().duration(700).delay(function(d, i) { return i * 35; }).attr("r", 5);
    c2.transition().duration(700).delay(function(d, i) { return i * 35; }).attr("r", 5);
    c1
        .on("mouseover", function(e, d) {
            let t = "";
            if (d.margin > 0) {
                t = "D +" + Math.abs(d.margin).toFixed(2) + " pts";
            } else {
                t = "R +" + Math.abs(d.margin).toFixed(2) + " pts";
            }
            tip
                .html("<strong>" + d.year + "</strong><br>Democratic share: " + d.demShare.toFixed(2) + "%<br>National margin: " + t)
                .classed("visible", true)
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mousemove", function(e) {
            tip
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mouseout", function() {
            tip.classed("visible", false);
        });
    c2
        .on("mouseover", function(e, d) {
            let t = "";
            if (d.margin > 0) {
                t = "D +" + Math.abs(d.margin).toFixed(2) + " pts";
            } else {
                t = "R +" + Math.abs(d.margin).toFixed(2) + " pts";
            }
            tip
                .html("<strong>" + d.year + "</strong><br>Republican share: " + d.repShare.toFixed(2) + "%<br>National margin: " + t)
                .classed("visible", true)
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mousemove", function(e) {
            tip
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mouseout", function() {
            tip.classed("visible", false);
        });
    a0.append("text")
        .attr("class", "party-label")
        .attr("x", w - 10)
        .attr("y", y(z[z.length - 1].demShare))
        .attr("text-anchor", "end")
        .attr("fill", pc.DEMOCRAT)
        .text("Democratic share");
    a0.append("text")
        .attr("class", "party-label")
        .attr("x", w - 10)
        .attr("y", y(z[z.length - 1].repShare) + 4)
        .attr("text-anchor", "end")
        .attr("fill", pc.REPUBLICAN)
        .text("Republican share");
}
function near20() {
    a1.selectAll("*").remove();
    const z = electionStoryData.close2020.slice().sort(function(a, b) { return a.margin - b.margin; });
    const x = d3.scaleLinear()
        .domain([-10, 10])
        .range([0, w]);
    const y = d3.scaleBand()
        .domain(z.map(function(d) { return d.statePo; }))
        .range([0, h])
        .padding(0.4);
    const r = d3.scaleSqrt()
        .domain(d3.extent(z, function(d) { return d.totalVotes; }))
        .range([6, 18]);
    a1.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(8).tickSize(-h).tickFormat(""));
    a1.append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0)
        .attr("y2", h)
        .attr("stroke", "#999999");
    a1.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).tickSize(0));
    a1.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(8).tickFormat(function(d) { return d + "%"; }));
    a1.append("text")
        .attr("class", "axis-label")
        .attr("x", w / 2)
        .attr("y", h + 52)
        .attr("text-anchor", "middle")
        .text("Democratic margin in 2020");
    a1.append("text")
        .attr("class", "party-label")
        .attr("x", x(-8.5))
        .attr("y", -18)
        .attr("fill", pc.REPUBLICAN)
        .text("Republican side");
    a1.append("text")
        .attr("class", "party-label")
        .attr("x", x(6.3))
        .attr("y", -18)
        .attr("fill", pc.DEMOCRAT)
        .text("Democratic side");
    const rows = a1.selectAll(".close-row")
        .data(z)
        .enter()
        .append("g")
        .attr("class", "close-row");
    rows.append("line")
        .attr("class", "lollipop-stem")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", function(d) { return y(d.statePo) + y.bandwidth() / 2; })
        .attr("y2", function(d) { return y(d.statePo) + y.bandwidth() / 2; })
        .attr("stroke", function(d) { return pc[d.winner]; })
        .transition()
        .duration(800)
        .attr("x2", function(d) { return x(d.margin); });
    rows.append("circle")
        .attr("class", "close-dot")
        .attr("cx", x(0))
        .attr("cy", function(d) { return y(d.statePo) + y.bandwidth() / 2; })
        .attr("r", 0)
        .attr("fill", function(d) { return pc[d.winner]; })
        .transition()
        .duration(800)
        .attr("cx", function(d) { return x(d.margin); })
        .attr("r", function(d) { return r(d.totalVotes); });
    rows.append("text")
        .attr("class", "chart-label")
        .attr("x", function(d) { return x(d.margin) + (d.margin > 0 ? 14 : -14); })
        .attr("y", function(d) { return y(d.statePo) + y.bandwidth() / 2 + 4; })
        .attr("text-anchor", function(d) { return d.margin > 0 ? "start" : "end"; })
        .text(function(d) {
            if (d.margin > 0) {
                return "+" + d.margin.toFixed(2) + " pts";
            }
            return d.margin.toFixed(2) + " pts";
        });
    rows
        .on("mouseover", function(e, d) {
            let side = "Republican";
            let t = "";
            if (d.winner === "DEMOCRAT") {
                side = "Democratic";
            }
            if (d.margin > 0) {
                t = "D +" + Math.abs(d.margin).toFixed(2) + " pts";
            } else {
                t = "R +" + Math.abs(d.margin).toFixed(2) + " pts";
            }
            tip
                .html("<strong>" + d.state + "</strong><br>" + side + " win: " + t + "<br>Total votes: " + d3.format(",")(d.totalVotes))
                .classed("visible", true)
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mousemove", function(e) {
            tip
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mouseout", function() {
            tip.classed("visible", false);
        });
}
function moveDots() {
    a2.selectAll("*").remove();
    const z = electionStoryData.realignment;
    const x = d3.scaleLinear()
        .domain([-60, 60])
        .range([0, w]);
    const y = d3.scaleLinear()
        .domain([-60, 60])
        .range([h, 0]);
    const r = d3.scaleSqrt()
        .domain(d3.extent(z, function(d) { return d.totalVotes2020; }))
        .range([4, 16]);
    a2.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(6).tickSize(-h).tickFormat(""));
    a2.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks(6).tickSize(-w).tickFormat(""));
    a2.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(x).ticks(6).tickFormat(function(d) { return d + "%"; }));
    a2.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { return d + "%"; }));
    a2.append("text")
        .attr("class", "axis-label")
        .attr("x", w / 2)
        .attr("y", h + 52)
        .attr("text-anchor", "middle")
        .text("Democratic margin in 2008");
    a2.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -h / 2)
        .attr("y", -58)
        .attr("text-anchor", "middle")
        .text("Democratic margin in 2020");
    a2.append("line")
        .attr("class", "diagonal")
        .attr("x1", x(-60))
        .attr("x2", x(60))
        .attr("y1", y(-60))
        .attr("y2", y(60));
    a2.append("text")
        .attr("class", "annotation")
        .attr("x", x(-52))
        .attr("y", y(42))
        .text("Above the line = moved toward Democrats");
    a2.append("text")
        .attr("class", "annotation")
        .attr("x", x(10))
        .attr("y", y(-44))
        .text("Below the line = moved toward Republicans");
    const dots = a2.selectAll(".realignment-dot")
        .data(z)
        .enter()
        .append("circle")
        .attr("class", "realignment-dot")
        .attr("cx", function(d) { return x(d.margin2008); })
        .attr("cy", function(d) { return y(d.margin2008); })
        .attr("r", function(d) { return r(d.totalVotes2020); })
        .attr("fill", function(d) { return rc[d.region]; })
        .attr("opacity", 0.88);
    dots.transition()
        .duration(900)
        .attr("cy", function(d) { return y(d.margin2020); });
    dots
        .on("mouseover", function(e, d) {
            let t1 = "";
            let t2 = "";
            if (d.margin2008 > 0) {
                t1 = "D +" + Math.abs(d.margin2008).toFixed(2) + " pts";
            } else {
                t1 = "R +" + Math.abs(d.margin2008).toFixed(2) + " pts";
            }
            if (d.margin2020 > 0) {
                t2 = "D +" + Math.abs(d.margin2020).toFixed(2) + " pts";
            } else {
                t2 = "R +" + Math.abs(d.margin2020).toFixed(2) + " pts";
            }
            tip
                .html("<strong>" + d.state + "</strong><br>2008: " + t1 + "<br>2020: " + t2 + "<br>Shift: " + (d.shift2008to2020 > 0 ? "+" : "") + d.shift2008to2020.toFixed(2) + " pts")
                .classed("visible", true)
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mousemove", function(e) {
            tip
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mouseout", function() {
            tip.classed("visible", false);
        });
    a2.selectAll(".state-label")
        .data(z.filter(function(d) { return d.label; }))
        .enter()
        .append("text")
        .attr("class", "state-label")
        .attr("x", function(d) { return x(d.margin2008) + 8; })
        .attr("y", function(d) { return y(d.margin2020) - 8; })
        .text(function(d) { return d.statePo; });
    const lg = a2.append("g")
        .attr("transform", `translate(${w - 140}, -92)`);
    Object.keys(rc).forEach(function(k, i) {
        const one = lg.append("g")
            .attr("transform", `translate(0, ${i * 24})`);
        one.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 6)
            .attr("fill", rc[k]);
        one.append("text")
            .attr("class", "legend-label")
            .attr("x", 14)
            .attr("y", 4)
            .text(k);
    });
}
const tree = function() {
    a3.selectAll("*").remove();
    const root = d3.hierarchy(electionStoryData.treemap2020)
        .sum(function(d) { return d.value || 0; })
        .sort(function(a, b) { return b.value - a.value; });
    d3.treemap()
        .size([w, h])
        .paddingOuter(4)
        .paddingTop(function(d) {
            if (d.depth === 1) {
                return 28;
            }
            if (d.depth === 2) {
                return 20;
            }
            return 0;
        })
        .paddingInner(3)(root);
    a3.selectAll(".treemap-parent")
        .data(root.descendants().filter(function(d) { return d.depth === 1; }))
        .enter()
        .append("rect")
        .attr("class", "treemap-parent")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("stroke", function(d) { return pc[d.data.party]; });
    a3.selectAll(".winner-label")
        .data(root.descendants().filter(function(d) { return d.depth === 1; }))
        .enter()
        .append("text")
        .attr("class", "party-label")
        .attr("x", function(d) { return d.x0 + 8; })
        .attr("y", function(d) { return d.y0 + 18; })
        .attr("fill", function(d) { return pc[d.data.party]; })
        .text(function(d) { return d.data.name; });
    a3.selectAll(".region-label")
        .data(root.descendants().filter(function(d) { return d.depth === 2; }))
        .enter()
        .append("text")
        .attr("class", "legend-label")
        .attr("x", function(d) { return d.x0 + 6; })
        .attr("y", function(d) { return d.y0 + 14; })
        .text(function(d) { return d.data.name; });
    const leaves = a3.selectAll(".treemap-leaf-group")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("class", "treemap-leaf-group")
        .attr("transform", function(d) {
            return `translate(${d.x0},${d.y0})`;
        });
    leaves.append("rect")
        .attr("class", "treemap-leaf")
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", function(d) { return rc[d.data.region]; })
        .attr("fill-opacity", 0.82)
        .attr("stroke", function(d) { return pc[d.data.party]; })
        .transition()
        .duration(850)
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; });
    leaves
        .on("mouseover", function(e, d) {
            let side = "Republican";
            let t = "";
            if (d.data.party === "DEMOCRAT") {
                side = "Democratic";
            }
            if (d.data.margin > 0) {
                t = "D +" + Math.abs(d.data.margin).toFixed(2) + " pts";
            } else {
                t = "R +" + Math.abs(d.data.margin).toFixed(2) + " pts";
            }
            tip
                .html("<strong>" + d.data.state + "</strong><br>" + side + " winning votes: " + d3.format(",")(d.data.winnerVotes) + "<br>Margin: " + t)
                .classed("visible", true)
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mousemove", function(e) {
            tip
                .style("left", (e.clientX + 12) + "px")
                .style("top", (e.clientY + 12) + "px");
        })
        .on("mouseout", function() {
            tip.classed("visible", false);
        });
    leaves.filter(function(d) {
        return (d.x1 - d.x0) > 40 && (d.y1 - d.y0) > 22;
    })
        .append("text")
        .attr("class", "treemap-text")
        .attr("x", 6)
        .attr("y", 14)
        .text(function(d) { return d.data.name; });
    leaves.filter(function(d) {
        return (d.x1 - d.x0) > 62 && (d.y1 - d.y0) > 36;
    })
        .append("text")
        .attr("class", "treemap-subtext")
        .attr("x", 6)
        .attr("y", 28)
        .text(function(d) {
            if (d.data.margin > 0) {
                return "D +" + Math.abs(d.data.margin).toFixed(2) + " pts";
            }
            return "R +" + Math.abs(d.data.margin).toFixed(2) + " pts";
        });
    const lg = a3.append("g")
        .attr("transform", `translate(${w - 140}, -92)`);
    lg.append("text")
        .attr("class", "legend-label")
        .attr("x", 0)
        .attr("y", -12)
        .text("Region colors");
    Object.keys(rc).forEach(function(k, i) {
        const one = lg.append("g")
            .attr("transform", `translate(0, ${i * 22})`);
        one.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", rc[k])
            .attr("fill-opacity", 0.82);
        one.append("text")
            .attr("class", "legend-label")
            .attr("x", 18)
            .attr("y", 10)
            .text(k);
    });
};
function flip(gx, on) {
    gx
        .classed("active", on)
        .transition()
        .duration(400)
        .style("opacity", on ? 1 : 0);
}
function show0() {
    now = 0;
    ss.classed("is-active", function(d, j) {
        return j === 0;
    });
    flip(a0, true);
    flip(a1, false);
    flip(a2, false);
    flip(a3, false);
    do0();
}
function show1() {
    now = 1;
    ss.classed("is-active", function(d, j) {
        return j === 1;
    });
    flip(a0, false);
    flip(a1, true);
    flip(a2, false);
    flip(a3, false);
    near20();
}
function show2() {
    now = 2;
    ss.classed("is-active", function(d, j) {
        return j === 2;
    });
    flip(a0, false);
    flip(a1, false);
    flip(a2, true);
    flip(a3, false);
    moveDots();
}
function show3() {
    now = 3;
    ss.classed("is-active", function(d, j) {
        return j === 3;
    });
    flip(a0, false);
    flip(a1, false);
    flip(a2, false);
    flip(a3, true);
    tree();
}
function stepIn(res) {
    if (res.index === 0) {
        show0();
    } else if (res.index === 1) {
        show1();
    } else if (res.index === 2) {
        show2();
    } else {
        show3();
    }
}
s
    .setup({
        step: ".step",
        offset: 0.55,
        debug: false
    })
    .onStepEnter(stepIn);
window.addEventListener("resize", function() {
    setLayout();
    s.resize();
    if (now === 0) {
        show0();
    } else if (now === 1) {
        show1();
    } else if (now === 2) {
        show2();
    } else {
        show3();
    }
});
show0();
