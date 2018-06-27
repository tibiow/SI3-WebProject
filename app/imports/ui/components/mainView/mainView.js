import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import template from './mainView.html';

import { name as StoryList } from '../storyList/storyList';
import { name as StoryView } from '../storyView/storyView';
import { name as GraphView } from '../graphView/graphView';

class MainView {}

const name = 'mainView';

// create a module
export default angular.module('webChronicles', [

        angularMeteor,
        ngMaterial,
        uiRouter,
        StoryList,
        StoryView,
        GraphView
    ]).component(name, {
        template,
        controllerAs: name,
        controller: MainView
    })
    .config(config);

function config($locationProvider, $urlRouterProvider, $mdIconProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/play');

    const iconPath = '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';

    $mdIconProvider
        .iconSet('av',
            iconPath + 'svg-sprite-av.svg')
        .iconSet('maps',
            iconPath + 'svg-sprite-maps.svg');
}
