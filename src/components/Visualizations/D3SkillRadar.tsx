import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface RadarData {
  axis: string;
  value: number;
  isMissing?: boolean;
}

interface D3RadarProps {
  data: RadarData[];
  width?: number;
  height?: number;
}

export default function D3SkillRadar({ data, width = 300, height = 300 }: D3RadarProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const radius = Math.min(w / 2, h / 2);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const axes = data.map(d => d.axis);
    const totalAxes = axes.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Radiant scale
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 100]);

    // Draw circular grid lines
    const gridLevels = 4;
    const gridWrapper = svg.append("g").attr("class", "gridWrapper");

    for (let i = 0; i < gridLevels; i++) {
      const levelFactor = radius * ((i + 1) / gridLevels);
      gridWrapper.append("circle")
        .attr("r", levelFactor)
        .style("fill", "none")
        .style("stroke", "rgba(255,255,255,0.05)")
        .style("stroke-dasharray", "4 4");
    }

    // Draw axes
    const axisGrid = svg.append("g").attr("class", "axisWrapper");
    
    // Create axes
    const axis = axisGrid.selectAll(".axis")
      .data(axes)
      .enter()
      .append("g")
      .attr("class", "axis");

    // Axis lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("class", "line")
      .style("stroke", "rgba(255,255,255,0.1)")
      .style("stroke-width", "1px");

    // Axis labels
    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .style("font-family", "JetBrains Mono, monospace")
      .style("font-weight", "600")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => rScale(100 * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => rScale(100 * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .style("fill", (d, i) => data[i].isMissing ? "#FF2A5F" : "rgba(255,255,255,0.6)")
      .style("filter", (d, i) => data[i].isMissing ? "drop-shadow(0 0 5px rgba(255,42,95,0.6))" : "none")
      // Opacity transition for sleek feel
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);


    // Draw Radar Blob
    const radarLine = d3.lineRadial<RadarData>()
      .angle((d, i) => i * angleSlice)
      .radius(d => rScale(d.value))
      .curve(d3.curveLinearClosed);

    const blobWrapper = svg.append("g").attr("class", "radarWrapper");

    // Determine main color based on whether ANY missing skill exists
    const hasMissing = data.some(d => d.isMissing);
    const primaryColor = hasMissing ? "rgba(157, 0, 255, 1)" : "rgba(0, 245, 255, 1)";
    const fillColor = hasMissing ? "rgba(157, 0, 255, 0.15)" : "rgba(0, 245, 255, 0.15)";

    blobWrapper.append("path")
      .attr("class", "radarArea")
      .attr("d", radarLine(data))
      .style("fill", fillColor)
      .style("stroke-width", 2)
      .style("stroke", primaryColor)
      .style("filter", `drop-shadow(0 0 10px ${primaryColor})`)
      .style("transform-origin", "center")
      .style("transform", "scale(0)")
      .style("opacity", 0)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .style("transform", "scale(1)")
      .style("opacity", 1);

    // Draw individual nodes / dots
    blobWrapper.selectAll(".radarCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", d => d.isMissing ? 6 : 4)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", d => d.isMissing ? "#FF2A5F" : primaryColor)
      .style("stroke", d => d.isMissing ? "rgba(255,42,95,0.4)" : "rgba(0,0,0,0.5)")
      .style("stroke-width", 2)
      .style("filter", d => d.isMissing ? "drop-shadow(0 0 8px rgba(255,42,95,0.8))" : "none")
      .style("opacity", 0)
      .transition()
      .delay((d, i) => i * 150)
      .duration(800)
      .style("opacity", 1);
      
  }, [data, width, height]);

  return (
    <div className="relative flex items-center justify-center pointer-events-none">
      <svg ref={svgRef}></svg>
    </div>
  );
}
