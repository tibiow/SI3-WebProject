/**
 * Created by aelar on 06/06/16.
 */

var Cstory;
var Path;

module.exports = {
    loadXML: function(path) {
        var X2JS = require("x2js");
        this.Path = path;

        var xmlConverter = new X2JS();
        var xmlText = Assets.getText(path);
        var jsonObj = xmlConverter.xml2js(xmlText);
        return jsonObj;
    },
    getStep: function (id) {
        if(this.Cstory == undefined){
            this.Cstory = this.loadXML(this.Path);
        }
        var steps = this.Cstory.story.step;

        for (var i in steps) {

            if (steps[i].id == id) return steps[i];
        }
    },

    getNexts: function (id) {
        var step = this.getStep(id);


        var choice = null;
        switch (step.type) {
            case 'multipleChoice':
                choice = step.choices.choice;

                break;
            case 'riddle':
                choice = step.answers;
                break;
            case 'end':
                break;
        }


        var nextSteps = {
            next: []
        };

        for (var i in choice) {
            nextSteps.next.push(choice[i].nextStep);
        }

        return nextSteps;

    },
    getNexts: function (id,step) {
        //var step = this.getStep(id);


        var choice = null;
        switch (step.type) {
            case 'multipleChoice':
                choice = step.choices.choice;

                break;
            case 'riddle':
                choice = step.answers;
                break;
            case 'end':
                break;
        }


        var nextSteps = {
            next: []
        };

        for (var i in choice) {
            nextSteps.next.push(choice[i].nextStep);
        }

        return nextSteps;

    }
};
