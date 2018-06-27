import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './storyList.html'

class StoryList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);
    this.search = "";

    this.helpers({
      stories() {
        return Stories.find({});
      }
    });
  }
}

const name = 'storyList';

export default angular.module(name, [
  angularMeteor,
  uiRouter
])
.component(name, {
  template,
  controllerAs: name,
  controller: StoryList
})
.config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('stories', {
      url: '/play',
      template: '<story-list></story-list>'
    });
}
