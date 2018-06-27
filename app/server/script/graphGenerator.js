/**
 * Created by aelar on 07/06/16.
 */

var cyto = require('cytoscape');

var parser = require("./xmlParser");

function graphCreator(file) {
    console.log(file);
    var story = Stories.findOne({
        "_id": file[0]
    });
    console.log(story)
    var jsonHistory = story.story.step;
    var graph = cyto();
    //console.log(story.story.step);
    return buildGraph(graph,jsonHistory);
}

function buildGraph(graph,steps) {
    var nexts;
    var nbEdges=0;
    //console.log(graph);
    //console.log(steps[2].id);




    for(var i in steps){

        graph.add({
            group: "nodes",
            data: {id: steps[i].id}
        });

        nexts = parser.getNexts(i,steps).next;

        for(var j in nexts){

                graph.add({group: "nodes", data: {id: nexts[j]}});
                graph.add({group: "edges", data: {id: "e" + nbEdges++, source: steps[i].id, target: nexts[j]}})

        }
    }
    console.log(graph);
    return graph;
}

Meteor.methods({
    graphCreator
});
