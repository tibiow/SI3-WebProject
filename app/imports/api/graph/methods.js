import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

//import { Stories } from 'collection';

export function createGraph(storyId) {
    var graph = {};
    if(Meteor.isServer){
        var story = Stories.findOne({
            "_id": storyId
        });
        //graph = createGraph(story);
    }

    return "keval";
}

Meteor.methods({
    createGraph
});