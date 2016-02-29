(function () {
  'use strict';

  describe('Seeds Route Tests', function () {
    // Initialize global variables
    var $scope,
      SeedsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SeedsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SeedsService = _SeedsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('seeds');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/seeds');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SeedsController,
          mockSeed;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('seeds.view');
          $templateCache.put('modules/seeds/client/views/view-seed.client.view.html', '');

          // create mock Seed
          mockSeed = new SeedsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Seed Name'
          });

          //Initialize Controller
          SeedsController = $controller('SeedsController as vm', {
            $scope: $scope,
            seedResolve: mockSeed
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:seedId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.seedResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            seedId: 1
          })).toEqual('/seeds/1');
        }));

        it('should attach an Seed to the controller scope', function () {
          expect($scope.vm.seed._id).toBe(mockSeed._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/seeds/client/views/view-seed.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SeedsController,
          mockSeed;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('seeds.create');
          $templateCache.put('modules/seeds/client/views/form-seed.client.view.html', '');

          // create mock Seed
          mockSeed = new SeedsService();

          //Initialize Controller
          SeedsController = $controller('SeedsController as vm', {
            $scope: $scope,
            seedResolve: mockSeed
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.seedResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/seeds/create');
        }));

        it('should attach an Seed to the controller scope', function () {
          expect($scope.vm.seed._id).toBe(mockSeed._id);
          expect($scope.vm.seed._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/seeds/client/views/form-seed.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SeedsController,
          mockSeed;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('seeds.edit');
          $templateCache.put('modules/seeds/client/views/form-seed.client.view.html', '');

          // create mock Seed
          mockSeed = new SeedsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Seed Name'
          });

          //Initialize Controller
          SeedsController = $controller('SeedsController as vm', {
            $scope: $scope,
            seedResolve: mockSeed
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:seedId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.seedResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            seedId: 1
          })).toEqual('/seeds/1/edit');
        }));

        it('should attach an Seed to the controller scope', function () {
          expect($scope.vm.seed._id).toBe(mockSeed._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/seeds/client/views/form-seed.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
