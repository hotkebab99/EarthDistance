import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

import { D3Service, D3, Selection, ZoomBehavior } from 'd3-ng2-service';

import { feature } from 'topojson';

@Component({
  selector: 'iex-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})
export class WorldMapComponent implements OnInit {

  private d3: D3;
  private parentNativeElement: any;
  private g: any;
  private svg: any;
  private zoom: ZoomBehavior<any, any>;

  private width: number = 815;
  private height: number = 600;
  private center = [this.width / 2, this.height / 2];


  constructor(element: ElementRef, d3Service: D3Service, private http: Http) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    if (this.parentNativeElement !== null)
      this.draw();
  }

  draw() {
    let d3 = this.d3;

    var projection = d3
      .geoMercator()
      .scale(130)
      .translate([this.width / 2, this.height / 2 + 100]);

    this.zoom = d3.zoom()
      .scaleExtent([1, 30])
      .translateExtent([[0, 0], [this.width, this.height]])
      .on("zoom", () => {
        this.g.attr("transform", d3.event.transform);
      });

      console.log(this.zoom);


    var path = d3.geoPath().projection(projection);

    this.svg = d3.select("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.g = this.svg.append('g');

    this.svg.append("rect")
      .attr("width", this.width)
      .attr("height", this.height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .style("stroke", "blue")  // colour the line
      .attr("stroke-width", 1);

    this.svg.call(this.zoom);

    this.http.get('./assets/world-50m.json').map((res: Response) => res.json()).subscribe(res => {

      this.g.selectAll("path.land").data([feature(res, res.objects.land)])
        .enter()
        .append("path")
        .attr("class", "land")
        .attr("d", path)
        .style("fill", "yellow");

      this.g.selectAll("path.countries").data([feature(res, res.objects.countries)])
        .enter()
        .append("path")
        .attr("class", "countries")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "blue")  // colour the line
        .attr("stroke-width", 0.2);


    });
  }

  private buttonZoom(inOut: boolean) {
    
    let d3 = this.d3;
    let t = d3.zoomTransform(this.svg.node());

    let newZoom = t.k + (inOut ? 0.1 : -0.1);

    if(newZoom < 1)
      return;
  
    this.g.transition()
          .duration(250)
          .attr("transform", "translate(" + t.x + "," + t.y + ")scale(" + newZoom + ")")
          .on("end", () => { this.svg.call(this.zoom.transform, d3.zoomIdentity.translate(t.x,t.y).scale(newZoom))});
 
  }

}
