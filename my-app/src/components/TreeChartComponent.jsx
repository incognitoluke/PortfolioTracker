import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeChartComponent = () => {
  const svgRef = useRef();

  // S&P 500 data with top companies by market cap (in billions)
  const sp500Data = [
    { name: 'AAPL', company: 'Apple Inc.', size: 3000, sector: 'XLK' },
    { name: 'MSFT', company: 'Microsoft Corp.', size: 2800, sector: 'XLK' },
    { name: 'GOOGL', company: 'Alphabet Inc.', size: 1700, sector: 'XLK' },
    { name: 'AMZN', company: 'Amazon.com Inc.', size: 1500, sector: 'XLY' },
    { name: 'NVDA', company: 'NVIDIA Corp.', size: 1200, sector: 'XLK' },
    { name: 'TSLA', company: 'Tesla Inc.', size: 800, sector: 'XLY' },
    { name: 'META', company: 'Meta Platforms Inc.', size: 750, sector: 'XLK' },
    { name: 'BRK.B', company: 'Berkshire Hathaway Inc.', size: 700, sector: 'XLF' },
    { name: 'UNH', company: 'UnitedHealth Group Inc.', size: 500, sector: 'XLV' },
    { name: 'JNJ', company: 'Johnson & Johnson', size: 450, sector: 'XLV' },
    { name: 'JPM', company: 'JPMorgan Chase & Co.', size: 420, sector: 'XLF' },
    { name: 'V', company: 'Visa Inc.', size: 400, sector: 'XLF' },
    { name: 'PG', company: 'Procter & Gamble Co.', size: 380, sector: 'XLP' },
    { name: 'XOM', company: 'Exxon Mobil Corp.', size: 350, sector: 'XLE' },
    { name: 'HD', company: 'Home Depot Inc.', size: 330, sector: 'XLY' },
    { name: 'MA', company: 'Mastercard Inc.', size: 320, sector: 'XLF' },
    { name: 'CVX', company: 'Chevron Corp.', size: 300, sector: 'XLE' },
    { name: 'KO', company: 'Coca-Cola Co.', size: 280, sector: 'XLP' },
    { name: 'ABBV', company: 'AbbVie Inc.', size: 270, sector: 'XLV' },
    { name: 'PFE', company: 'Pfizer Inc.', size: 250, sector: 'XLV' },
    { name: 'BAC', company: 'Bank of America Corp.', size: 240, sector: 'XLF' },
    { name: 'AVGO', company: 'Broadcom Inc.', size: 230, sector: 'XLK' },
    { name: 'WMT', company: 'Walmart Inc.', size: 220, sector: 'XLP' },
    { name: 'LLY', company: 'Eli Lilly & Co.', size: 210, sector: 'XLV' },
    { name: 'CRM', company: 'Salesforce Inc.', size: 200, sector: 'XLK' },
    { name: 'TMO', company: 'Thermo Fisher Scientific Inc.', size: 190, sector: 'XLV' },
    { name: 'ORCL', company: 'Oracle Corp.', size: 180, sector: 'XLK' },
    { name: 'COST', company: 'Costco Wholesale Corp.', size: 170, sector: 'XLP' },
    { name: 'ACN', company: 'Accenture PLC', size: 160, sector: 'XLK' },
    { name: 'DIS', company: 'Walt Disney Co.', size: 150, sector: 'XLC' }
  ];

  // GICS sector mapping with full names for tooltips
  const sectorMapping = {
    'XLK': 'Technology',
    'XLV': 'Healthcare', 
    'XLF': 'Financial Services',
    'XLY': 'Consumer Discretionary',
    'XLP': 'Consumer Staples',
    'XLE': 'Energy',
    'XLC': 'Communication Services'
  };

  // Sector color mapping using GICS abbreviations
  const sectorColors = {
    'XLK': '#2563eb',
    'XLV': '#16a34a',
    'XLF': '#dc2626',
    'XLY': '#ca8a04',
    'XLP': '#9333ea',
    'XLE': '#c2410c',
    'XLC': '#0891b2'
  };

  // Transform data into hierarchical structure grouped by sector
  const createHierarchicalData = (data) => {
    // Group data by sector
    const groupedBySector = d3.group(data, d => d.sector);
    
    // Convert to hierarchical structure
    const sectors = Array.from(groupedBySector, ([sector, companies]) => ({
      name: sector,
      children: companies.map(company => ({
        name: company.name,
        company: company.company,
        size: company.size,
        sector: company.sector
      }))
    }));

    return {
      name: "S&P 500",
      children: sectors
    };
  };

  // Custom content renderer function
  const renderContent = (svg, root) => {
    console.log('Rendering treemap with root:', root);

    // Create tooltip
    const tooltip = d3.select("body").selectAll(".d3-tooltip")
      .data([0])
      .join("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "12px 16px")
      .style("border-radius", "8px")
      .style("font-size", "14px")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.3)")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Main container group with safety margin
    const mainGroup = svg.append("g")
      .attr("transform", "translate(10, 10)");

    // Render sector groups (level 1)
    const sectorGroups = mainGroup.selectAll(".sector-group")
      .data(root.children)
      .join("g")
      .attr("class", "sector-group");

    // Add sector background rectangles with rounded corners
    sectorGroups.selectAll(".sector-bg")
      .data(d => [d])
      .join("rect")
      .attr("class", "sector-bg")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => sectorColors[d.data.name] || '#64748b')
      .attr("fill-opacity", 0.08)
      .attr("stroke", d => sectorColors[d.data.name] || '#64748b')
      .attr("stroke-width", 2)
      .attr("rx", 8)
      .attr("ry", 8);

    // Add sector titles positioned inside the sector area
    sectorGroups.selectAll(".sector-title")
      .data(d => [d])
      .join("text")
      .attr("class", "sector-title")
      .attr("x", d => d.x0 + 12)
      .attr("y", d => d.y0 + 20)
      .attr("text-anchor", "start")
      .attr("fill", d => sectorColors[d.data.name] || '#64748b')
      .attr("font-size", d => {
        const width = d.x1 - d.x0;
        if (width > 250) return "16px";
        if (width > 180) return "14px";
        if (width > 120) return "12px";
        return "10px";
      })
      .attr("font-weight", "700")
      .style("pointer-events", "none")
      .text(d => {
        const width = d.x1 - d.x0;
        const sectorTotal = d.value;
        const percentage = ((sectorTotal / root.value) * 100).toFixed(1);
        
        if (width > 280) {
          return `${d.data.name} • ${Math.round(sectorTotal)}B (${percentage}%)`;
        } else if (width > 180) {
          return `${d.data.name} • ${percentage}%`;
        } else {
          return d.data.name;
        }
      });

    // Add sector subtitle with company count (for larger sectors)
    sectorGroups.selectAll(".sector-subtitle")
      .data(d => [d])
      .join("text")
      .attr("class", "sector-subtitle")
      .attr("x", d => d.x0 + 12)
      .attr("y", d => d.y0 + 38)
      .attr("text-anchor", "start")
      .attr("fill", d => sectorColors[d.data.name] || '#64748b')
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("opacity", 0.8)
      .style("pointer-events", "none")
      .text(d => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        const companyCount = d.children ? d.children.length : 0;
        const fullSectorName = sectorMapping[d.data.name] || d.data.name;
        
        if (width > 200 && height > 70) {
          return `${fullSectorName} • ${companyCount} companies`;
        } else if (width > 120 && height > 50) {
          return fullSectorName;
        }
        return '';
      });

    // Render individual companies (leaves) with adjusted positioning
    const companyGroups = mainGroup.selectAll(".company-group")
      .data(root.leaves())
      .join("g")
      .attr("class", "company-group");

    // Add company rectangles with rounded corners
    companyGroups.selectAll(".company-rect")
      .data(d => [d])
      .join("rect")
      .attr("class", "company-rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => sectorColors[d.data.sector] || '#64748b')
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("fill-opacity", 0.85)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill-opacity", 1).attr("stroke-width", 3);
        const fullSectorName = sectorMapping[d.data.sector] || d.data.sector;
        tooltip.style("visibility", "visible")
          .style("border", `2px solid ${sectorColors[d.data.sector] || '#64748b'}`)
          .html(`
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${d.data.name}</div>
            <div style="margin-bottom: 4px; opacity: 0.9;">${d.data.company}</div>
            <div style="margin-bottom: 4px; color: ${sectorColors[d.data.sector] || '#64748b'};">${fullSectorName} (${d.data.sector})</div>
            <div style="font-weight: 600;">Market Cap: $${d.data.size.toLocaleString()}B</div>
          `);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill-opacity", 0.85).attr("stroke-width", 2);
        tooltip.style("visibility", "hidden");
      });

    // Add ticker symbols with better positioning
    companyGroups.selectAll(".ticker-text")
      .data(d => [d])
      .join("text")
      .attr("class", "ticker-text")
      .attr("x", d => d.x0 + (d.x1 - d.x0) / 2)
      .attr("y", d => d.y0 + (d.y1 - d.y0) / 2 - 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#fff")
      .attr("font-weight", "700")
      .attr("font-size", d => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return Math.min(width / 5, height / 3.5, 18) + "px";
      })
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 2px rgba(0,0,0,0.3)")
      .text(d => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return (width > 45 && height > 30) ? d.data.name : '';
      });

    // Add market cap labels with better positioning
    companyGroups.selectAll(".cap-text")
      .data(d => [d])
      .join("text")
      .attr("class", "cap-text")
      .attr("x", d => d.x0 + (d.x1 - d.x0) / 2)
      .attr("y", d => d.y0 + (d.y1 - d.y0) / 2 + 16)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#fff")
      .attr("font-size", d => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return Math.min(width / 10, height / 5, 13) + "px";
      })
      .attr("font-weight", "500")
      .attr("opacity", 0.95)
      .style("pointer-events", "none")
      .style("text-shadow", "0 1px 2px rgba(0,0,0,0.3)")
      .text(d => {
        const width = d.x1 - d.x0;
        const height = d.y1 - d.y0;
        return (width > 65 && height > 45) ? `$${d.data.size}B` : '';
      });
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Use responsive dimensions that work in the artifact environment
    const width = 1200;
    const height = 700;
    
    // Create the treemap layout with enhanced padding for sector titles
    const treemap = d3.treemap()
      .size([width - 20, height - 20]) // Reduce size to prevent overflow
      .padding(4) // Outer padding between sectors
      .paddingInner(8) // Inner padding within sectors
      .paddingOuter(10) // Outer padding around the entire treemap
      .paddingTop(80) // Much larger space at top for sector titles and subtitles
      .paddingLeft(12) // Extra space on left for sector titles
      .paddingRight(12) // Right padding
      .paddingBottom(20) // More bottom padding for space between border and tiles
      .round(true);

    // Create hierarchical data structure
    const hierarchicalData = createHierarchicalData(sp500Data);
    
    // Create hierarchy from data
    const root = d3.hierarchy(hierarchicalData)
      .sum(d => d.size || 0)
      .sort((a, b) => b.value - a.value);

    // Generate the treemap
    treemap(root);

    // Use our custom render function
    renderContent(svg, root);

    // Cleanup function
    return () => {
      d3.selectAll(".d3-tooltip").remove();
    };
  }, []);

  const totalMarketCap = sp500Data.reduce((sum, item) => sum + item.size, 0);

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ padding: '20px 40px' }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: '400', 
          color: '#1e293b', 
          marginBottom: '8px' 
        }}>
          S&P 500 Market Cap by GICS Sector
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#64748b', 
          marginBottom: '20px' 
        }}>
          Top 30 companies grouped by GICS sector abbreviations • Total: ${totalMarketCap.toLocaleString()}B
        </p>
      </div>

      {/* D3 Treemap */}
      <div style={{ 
        width: 'calc(100% - 80px)', 
        height: 'calc(100vh - 280px)', 
        margin: '0 40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <svg 
          ref={svgRef} 
          width={1200} 
          height={700}
          style={{ width: '100%', height: '100%', maxWidth: '100%' }}
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
};

export default TreeChartComponent;