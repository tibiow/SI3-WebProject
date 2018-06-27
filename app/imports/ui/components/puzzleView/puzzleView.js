import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './puzzleView.html'

class PuzzleView {
    constructor($scope, $reactive, $compile) {
        'ngInject';

        $reactive(this).attach($scope);
        this.puzzle = Modules.client.challenge_taquin;
        this.loaded = false;
    }
    loadPuzzle() {
        this.puzzle.load();
        this.loaded = true;
    }
    checkWin() {
        this.puzzle.checkWin();
        if (this.puzzle.hasWon()) {
            Session.set("challenge_success", true);
            return true;
        }
        return false;
    }
}

const name = 'puzzleView';

export default angular.module(name, [
        angularMeteor
    ])
    .component(name, {
        template,
        controllerAs: name,
        controller: PuzzleView
    });
