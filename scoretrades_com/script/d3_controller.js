/**
 * Created by RemyValery on 6/2/2017.
 */

// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
var links = [
    {source: "Jane", target: "Paul", type: "licensing"},
    {source: "Jane", target: "Hosei", type: "licensing"},
    {source: "Simon", target: "Adrien", type: "suit"},
    {source: "Mathew", target: "Adrien", type: "suit"},
    {source: "Nathaniel", target: "Adrien", type: "resolved"},
    {source: "Hosei", target: "Adrien", type: "suit"},
    {source: "Kristine", target: "Adrien", type: "suit"},
    {source: "Jane", target: "Ben", type: "suit"},
    {source: "Jane", target: "Ben", type: "suit"},
    {source: "Oracle", target: "George", type: "suit"},
    {source: "Adam", target: "George", type: "suit"},
    {source: "Adrien", target: "Hosei", type: "suit"},
    {source: "Jane", target: "Yvette", type: "suit"},
    {source: "Simon", target: "Kristine", type: "resolved"},
    {source: "Lilian", target: "Kristine", type: "resolved"},
    {source: "Rachel", target: "Kristine", type: "suit"},
    {source: "Samuel", target: "Lilian", type: "suit"},
    {source: "Kristine", target: "Lilian", type: "resolved"},
    {source: "Adrien", target: "Nathaniel", type: "resolved"},
    {source: "Quinette", target: "Nathaniel", type: "resolved"},
    {source: "Adrien", target: "Mathew", type: "suit"},
    {source: "Jane", target: "Mathew", type: "suit"},
    {source: "Mathew", target: "Jane", type: "suit"},
    {source: "Hilda", target: "Zach", type: "suit"},
    {source: "Eric", target: "Zach", type: "suit"},
    {source: "Kristine", target: "Simon", type: "resolved"},
    {source: "Adrien", target: "Simon", type: "suit"},
    {source: "Kristine", target: "Rachel", type: "suit"},
    {source: "Nathaniel", target: "Quinette", type: "suit"}
];

var nodes = {};
var width = 960,
    height = 500;

// Compute the distinct nodes from the links.

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

function makeGraph(links) {

    // construct nodes from links
    function computeNode(links) {
        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
        });
    };
    computeNode(links);

// create the force simulator for the node
    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(40)
        .charge(-200)
        .on("tick", tick)
        .start();


// Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
        .enter().append("marker")
        .attr("id", function (d) {
            return d;
        })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", function (d) {
            return "link " + d.type;
        })
        .attr("marker-end", function (d) {
            return "url(#" + d.type + ")";
        });

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("r", 6)
        .call(force.drag);

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function (d) {
            return `${d.name},( ${truncate(d.x)}, ${truncate(d.y)})`;
        });

// Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
    }

    function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }

    function truncate(d) {
        return Math.round(d);
    }
}
makeGraph(links);

function addNode() {
    var source = $("[name='source']").val();
    var target = $("[name='target']").val();
    var type = $("[name='type']").find(":selected").val();
    $("[name='msg']").hide();
    var data = {source: source, target: target, type: type};
    links.push(data);
    console.log('node added', data);

    d3.select("defs").remove();
    d3.select("g").remove();
    d3.select("g").remove();
    d3.select("g").remove();

    makeGraph(links);
}