import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import {
    ReactiveVar
} from 'meteor/reactive-var';

import {
    name as PuzzleView
} from '../puzzleView/puzzleView'

import template from './storyView.html'

class StoryView {
    constructor($scope, $reactive, $stateParams, $state) {
        'ngInject';

        $reactive(this).attach($scope);
        this.storyId = $stateParams.storyId;
        this.chapterId = $stateParams.chapterId;
        this.reactStory = new ReactiveVar(null);

        this.riddleAnswer = "";
        this.riddleFailure = false;

        this.challengeSuccess = false;

        this.selectedChapter = this.chapterId;
        this.oneChoice = false;

        if (this.chapterId == 0) {
            Session.set("unlockedNodes", [true]);
            Session.set("totalSteps", 0);
        }
        Session.setDefault("unlockedNodes", [true]);
        Session.setDefault("totalSteps", 0);

        this.autorun(() => {
            this.submitAnswer(this.getReactively("riddleAnswer"));
            if (Session.get("challenge_success"))
                this.validateChallenge();
        });

        this.helpers({
            story: () => {
                var str = {};
                if (!this.reactStory.get()) {
                    var strTmp = Stories.findOne({
                        "_id": this.storyId
                    });
                    this.reactStory.set(strTmp);
                    str = strTmp;
                } else
                    str = this.reactStory.get();
                if (str && str.story)
                    return str.story;
                else
                    return null;
            },
            chapter: () => {
                var str = this.reactStory.get();
                var chapter = this.selectChapter(str, this.chapterId);
                var allowed = false;
                if (!(chapter && chapter.id)) return;

                var un = Session.get("unlockedNodes");
                if (!(un && un[chapter.id]))
                    $state.go('storyView', {
                        storyId: this.storyId,
                        chapterId: 0
                    });

                return chapter;
            },
            isRiddle: () => {
                return this.hasType("riddle");
            },
            isMultichoices: () => {
                return this.hasType("multipleChoice");
            },
            isPuzzle: () => {
                return this.hasType("puzzle");
            },
            isEnd: () => {
                return this.hasType("end");
            },
            endingStatus: () => {
                var chapter = this.selectChapter(this.reactStory.get(), this.chapterId);
                if (chapter && chapter.win == "true") {
                    $scope.endColor = "green";
                    return "won";
                }
                $scope.endColor = "red";
                return "lost";
            },
            choices: () => {
                var str = this.selectChapter(this.reactStory.get(), this.chapterId);
                if (str && str.choices) {
                    var chx = str.choices.choice;
                    if (Object.prototype.toString.call(chx) !== '[object Array]')
                        chx = [chx];

                    if (chx.length == 1) {
                        this.oneChoice = true;
                        this.selectedChapter = chx[0].nextStep;
                    }

                    return chx;
                }
            },
            totalSteps: () => {
                var steps = Session.get("totalSteps");
                return steps;
            }
        });
    }

    unlockNode() {
        var un = Session.get("unlockedNodes");
        un[this.selectedChapter] = true;
        Session.set("unlockedNodes", un);

        Session.set("totalSteps", Session.get("totalSteps") + 1);
    }

    hasType(type) {
        var chapter = this.selectChapter(this.reactStory.get(), this.chapterId);
        return chapter && chapter.type == type;
    }

    submitAnswer(answer) {
        var str = this.selectChapter(this.reactStory.get(), this.chapterId);
        if (!(str && str.answers))
            return;

        //encaspulate if needed
        var chx = str.answers.answer;
        if (Object.prototype.toString.call(str) !== '[object Array]')
            chx = [chx];

        //check the answer against the possibilities
        for (var i in chx) {
            if (chx[i].value == answer) {
                this.selectedChapter = chx[i].nextStep;
                this.riddleFailure = false;
                return;
            }
        }

        this.riddleFailure = true;
    }

    selectChapter(story, chapterId) {
        if (!(story && story.story.step))
            return;

        for (var i in story.story.step) {
            if (story.story.step[i].id == chapterId)
                return story.story.step[i];
        }
    }

    validateChallenge() {
        var chap = this.selectChapter(this.reactStory.get(), this.chapterId);
        if (chap && chap.nextStep)
            this.selectedChapter = chap.nextStep;
        this.challengeSuccess = true;
        Session.set("challenge_success", false);
    }
}

const name = 'storyView';

export default angular.module(name, [
        angularMeteor,
        uiRouter,
        PuzzleView
    ])
    .component(name, {
        template,
        controllerAs: name,
        controller: StoryView
    })
    .config(config);

function config($stateProvider) {
    'ngInject';

    $stateProvider.state('storyView', {
        url: '/play/:storyId/:chapterId',
        template: '<story-view></story-view>'
    });
}
