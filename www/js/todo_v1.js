angular.module("todoApp", []).
  directive("todoList", function($todo) {
    return {
      template: [
        '<i class="fa {{list.icon}} fa-2x fa-inverse"></i>',
        '<div class="text">',
        '  <p class="name" ng-bind="list.name"></p>',
        '  <p class="tasks">{{list.tasks.length || "No"}} tasks</p>',
        '</div>'
      ].join('\n'),
      scope: {
        list: "=todoList",
        ctrl: '=ctrl',
      },
      link: function(scope, element, attr) {
        element.on('click', function() {
          if (scope.ctrl.editing()) return;
          scope.$apply(function() {
            $todo.select(scope.list.name);
          });
        })
      }
    };
  }).
  directive("todoTask", function($todo) {
    return {
      template: [
        '<div class="text">',
        '  <p class="task-name" ng-bind="task.name"></p>',
        '</div>',
        '<div class="icons">',
        '  <a href ng-click="remove($event)" title="Delete Item" class="fa fa-trash fa-2x"></a>',
        '  <a href ng-click="edit($event)" title="Edit Item" class="fa fa-edit fa-2x"></a>',
        '</div>'
      ].join('\n'),
      scope: {
        task: '=todoTask',
        list: '=list',
        ctrl: '=ctrl'
      },
      link: function(scope, element, attr) {
        scope.remove = function(event) {
          if (scope.list) {
            var i, ii;
            for (i=0, ii=scope.list.length; i < ii; ++i) {
              if (scope.list[i] === scope.task) {
                scope.list.splice(i, 1);
                $todo.save();
                break;
              }
            }
          }
          event.preventDefault();
          event.stopPropagation();
        };
        scope.edit = function(event) {
          if (scope.ctrl) {
            scope.ctrl.edit(scope.task);
          }
          event.preventDefault();
          event.stopPropagation();
        };
      }
    };
  }).
  controller("todoCtrl", function($scope, $todo) {
    var self = this;
    this.taskFilter = {};
    this.toggleTaskFilter = function() {
      if (self.taskFilter.done === false) {
        delete self.taskFilter.done;
      } else {
        self.taskFilter.done = false;
      }
    };
    this.lists = $todo.lists();
    this.current = this.lists[0];
    this.select = function(name) {
      self.current = $todo.select(name);
    };
    this.editing = function() {
      return (self.newForm || self.editForm) || false;
    };
    this.create = function() {
      self.newForm = true;
      if (!self.current)
        self.current = self.lists[0];
    };
    this.edit = function(task) {
      self.editForm = true;
      self._new = task;
    };
    this.save = function() {
      if (self.newForm) {
        var current = self.current;
        if (!current.tasks) current.tasks = [];
        self._new.done = false;
        current.tasks.push(self._new);
      }
      $todo.save();
      self.newForm = self.editForm = false;
      self._new = null;
    }
    this.cancel = function() {
      self.newForm = self.editForm = false;
      self._new = null;
    };
    $scope.$on('$todo:list-changed', function(event, list) {
      self.current = list;
    });
  }).
  service('$todo', function($rootScope) {
    var self = this;
    var defaultLists = [
      {
        name: "Work",
        icon: "fa-suitcase",
        tasks: []
      },
      {
        name: "Health",
        icon: "fa-medkit",
        tasks: []
      },
      {
        name: "Reading",
        icon: "fa-book",
        tasks: []
      }
    ];
    var defaultListsJSON = JSON.stringify(defaultLists);
    var lists = JSON.parse(localStorage.getItem('TodoLists') || defaultListsJSON);
    this.lists = function() {
      return lists;
    };

    var current = null;
    this.select = function(name) {
      var i;
      var ii;
      if (current && current.name === name)
        return current;

      for (i=0, ii=lists.length; i<ii; ++i) {
        var list = lists[i];
        if (list && list.name === name) {
          notifyChanged(list);
          return current = self.current = list;
        }
      }

      notifyChanged(null);
      return current = self.current = null;
    };

    this.save = function() {
      localStorage.setItem('TodoLists', JSON.stringify(lists));
    }

    this.add = function(name, description, due) {
      lists.push({
        name: name,
        done: false,
        description: description,
        due: due || null
      });
      self.save();
    }

    function notifyChanged(list) {
      $rootScope.$broadcast('$todo:list-changed', list);
    }
  });
