(function () {
  'use strict';

  describe('Queues Route Tests', function () {
    // Initialize global variables
    var $scope,
      QueuesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QueuesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QueuesService = _QueuesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('queues');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/queues');
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
          QueuesController,
          mockQueue;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('queues.view');
          $templateCache.put('modules/queues/client/views/view-queue.client.view.html', '');

          // create mock Queue
          mockQueue = new QueuesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Queue Name'
          });

          //Initialize Controller
          QueuesController = $controller('QueuesController as vm', {
            $scope: $scope,
            queueResolve: mockQueue
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:queueId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.queueResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            queueId: 1
          })).toEqual('/queues/1');
        }));

        it('should attach an Queue to the controller scope', function () {
          expect($scope.vm.queue._id).toBe(mockQueue._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/queues/client/views/view-queue.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QueuesController,
          mockQueue;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('queues.create');
          $templateCache.put('modules/queues/client/views/form-queue.client.view.html', '');

          // create mock Queue
          mockQueue = new QueuesService();

          //Initialize Controller
          QueuesController = $controller('QueuesController as vm', {
            $scope: $scope,
            queueResolve: mockQueue
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.queueResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/queues/create');
        }));

        it('should attach an Queue to the controller scope', function () {
          expect($scope.vm.queue._id).toBe(mockQueue._id);
          expect($scope.vm.queue._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/queues/client/views/form-queue.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QueuesController,
          mockQueue;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('queues.edit');
          $templateCache.put('modules/queues/client/views/form-queue.client.view.html', '');

          // create mock Queue
          mockQueue = new QueuesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Queue Name'
          });

          //Initialize Controller
          QueuesController = $controller('QueuesController as vm', {
            $scope: $scope,
            queueResolve: mockQueue
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:queueId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.queueResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            queueId: 1
          })).toEqual('/queues/1/edit');
        }));

        it('should attach an Queue to the controller scope', function () {
          expect($scope.vm.queue._id).toBe(mockQueue._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/queues/client/views/form-queue.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
