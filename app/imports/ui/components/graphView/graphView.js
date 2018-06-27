import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import {
    ReactiveVar
} from 'meteor/reactive-var';

import template from './graphView.html'


class GraphView{
    //this.graphGen = {};

    constructor($scope, $reactive, $stateParams) {
        'ngInject';



        $reactive(this).attach($scope);

        this.storyId = $stateParams.storyId;


        //var graph = this.graphCreator(this.storyId);

        this.helpers({
            title: () => {
                var cyto = require('cytoscape');
                var steps = Stories.findOne({"_id": this.storyId});
                //console.log(steps);
                if(steps && steps.story.step)steps = steps.story;
                var graph = this.graphCreator(steps);
                graph.style(cyto.stylesheet()
                    .selector('node')
                    .css({
                        'content': 'data(title)'
                    })
                    .selector('edge')
                    .css({
                        'target-arrow-shape': 'triangle',
                        'width': 4,
                        'line-color': '#ddd',
                        'target-arrow-color': '#ddd',
                        'curve-style': 'bezier'
                    })
                    .selector('.begin')
                    .css({
                        'background-color': '#00f'
                    })
                    .selector('.win')
                    .css({
                        'background-color': '#0f0'
                    })
                    .selector('.loose')
                    .css({
                        'background-color': '#f00'
                    })
                );

                //console.log(graph)
                this.graph = graph;
                //console.log(this.graph);
                return graph;
            }
            });







    }

    graphCreator(file) {
        var cyto = require('cytoscape');
        //console.log(file);

        //console.log(story)
        var jsonHistory = file;
        var graph = cyto({

            container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true


        });


// kick off first highlight
        if (jsonHistory) {

        //console.log(jsonHistory);
        return buildGraph(graph, jsonHistory.step);
        }
        return graph;
    }


}




function buildGraph(graph,steps) {
    var nexts;
    var nbEdges=0;
    //console.log(graph);
    //console.log(steps);
    graph.add({
        group: "nodes",
        data: {id: steps[0].id,
            title: steps[0].title}
    }).addClass('begin');


    for(var i in steps){
        //console.log(i);
        graph.add({
            group: "nodes",
            data: {id: steps[i].id,
            title: steps[i].title}
        });

        nexts = getNexts(steps[i]);
        if(nexts.length == 0){
            console.log(steps[i].win);
            if(steps[i].win == 'true')
                graph.$('#'+steps[i].id).addClass('win');
            else graph.$('#'+steps[i].id).addClass('loose');
        }
        console.log("next"+nexts)
        for(var j in nexts){

            var next = $.grep(steps,function(e){return e.id == nexts[j]})
            console.log("nextSTep");
            console.log(next);
            graph.add({group: "nodes", data: {id: next[0].id,title: next[0].title}});
            graph.add({group: "edges", data: {id: "e" + nbEdges++,weight: 1, source: steps[i].id, target: next[0].id}})
            //console.log(graph.elements())
        }
    }
    graph.layout({
        name: 'cose',
        directed: true,
        roots: '#'+steps[0].id,
        padding: 10

    });
    dijkstra(steps);

    return graph;
}

function getNexts (step) {


    console.log("step"+step.title);
    var choice = null;
    switch (step.type) {
        case 'multipleChoice':
            choice = step.choices.choice;

            break;
        case 'riddle':
            choice = step.answers.answer;
            break;
        case 'end':
            break;
    }


    var nextSteps = {
        next: []
    };
    if(Array.isArray(choice)){
        for (var i in choice) {
            nextSteps.next.push(choice[i].nextStep);
        }
    }else if(choice){
        nextSteps.next.push(choice.nextStep);
    }

    console.log(nextSteps.next);
    if(nextSteps.next[0] == undefined) return [];
    return nextSteps.next;

}

function dijkstra(steps, aim){
    var visited = [];

    var path = [];
    var nodes = [];
    for(var i in steps){
        nodes[i] = {id:steps.id,next:getNexts(steps[i])}

    }
    visited[nodes[0]] = 0;

    while (nodes.length > 0){

        var min_node;
        for(var i in nodes){

            if(visited[nodes[i]]){
                console.log(visited)
                if(!min_node) {
                    min_node = nodes[i];
                }
                else if(visited[nodes[i]] < visited[min_node.id] ){

                    min_node = nodes[i];
                }
                console.log('nodes' + nodes[i]);
            }
        }
        if(min_node == null)break;
        nodes[min_node.id] = null;
        var current_weight = visited[min_node.id];
        var edges = edges(steps);

        for(var i in edges){
            var weight =  current_weight + 1;
            if(!visited[edges[i]] || weight < visitedEdge[edges[i]]){
                visited[edges[i]] = weight;
                path[edges[i]] = min_node;
            }
        }
    }

    console.log(path);

}

function edges(step){
    var edges = [];

    var nexts = getNexts(step);
    for( var j in nexts){
        edges.push({src: graph[i].id, end: nexts[j]});
    }

    return edges;
}

function init(size,d,sptset){

    for(var i = 0; i < size; ++i){
        d[i] = Infinity;
        sptset[i] = false;
    }
    d[0] = 0;
    return d;
}

function findMin(step,d, sptSet){
    var mini = Infinity;
    var sommet = -1;

    for (var i = 0; i <= step; ++i){
        if(sptSet[i] == false && d[i]< mini){
            mini = d[i]
            sommet = i;
        }
    }
    return mini
}


const name = 'graphView';

export default angular.module(name, [
    angularMeteor,
    uiRouter
])
    .component(name, {
        template,
        controllerAs: name,
        controller: GraphView
    })
    .config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('graphView', {
        url: '/show/:storyId',
        template: '<graph-view></graph-view>'
    });
}

