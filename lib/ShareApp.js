(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AddExpenseForm = React.createClass ({displayName: "AddExpenseForm",
  getInitialState: function () {
    return { splitBetween: {} };
  },
  handleOnSubmit: function (e) {
    e.preventDefault ();

    var amount = parseFloat (React.findDOMNode(this.refs.newExpenseAmount).value.trim());
    if (!amount) return;

    var newExpense = {};
    newExpense.key = window.expenseIndex++;
    newExpense.amount = amount;
    newExpense.paidBy = parseFloat (React.findDOMNode(this.refs.newExpensePayer).value.trim());
    newExpense.splitBetween = {};

    var that = this;
    this.props.users.forEach (function (user) {
      var isChecked = React.findDOMNode(that.refs['payer' + user.key]).checked;
      if (isChecked) newExpense.splitBetween[user.key] = true;
    });

    React.findDOMNode(this.refs.newExpenseAmount).value = null;
    React.findDOMNode(this.refs.newExpensePayer).value = this.props.users[0].key;
    this.props.users.forEach (function (user) {
      React.findDOMNode(that.refs['payer' + user.key]).checked = true;
    });

    return this.props.onAddExpense (newExpense);
  },
  render: function () {
    var userOptions = this.props.users.map (function (user) {
      return React.createElement("option", {value: user.key}, user.name);
    });
    var that = this;
    var userCheckboxes = this.props.users.map (function (user) {
      return (
        React.createElement("div", {className: "checkbox"}, 
          React.createElement("label", null, 
            React.createElement("input", {type: "checkbox", ref: 'payer' + user.key, defaultChecked: true}), 
            user.name
          )
        )
      );
    });
    if (!userOptions.length) {
      return (React.createElement("span", null));
    }
    return (
      React.createElement("div", {className: "col-lg-12"}, 
        React.createElement("div", {className: "panel panel-default"}, 
          React.createElement("div", {className: "panel-body"}, 
            React.createElement("p", null, 
              React.createElement("b", null, "Add expense")
            ), 
            React.createElement("form", {className: "form-horizontal", onSubmit: this.handleOnSubmit}, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "expense-amount", className: "col-sm-5 control-label"}, "Amount:"), 
                React.createElement("div", {className: "col-sm-7"}, 
                  React.createElement("input", {type: "number", className: "form-control", ref: "newExpenseAmount", id: "expense-amount", placeholder: "Amount"})
                )
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "expense-payer", className: "col-sm-5 control-label"}, "Who paid:"), 
                React.createElement("div", {className: "col-sm-7"}, 
                  React.createElement("select", {className: "form-control", ref: "newExpensePayer", id: "expense-payer"}, 
                    userOptions
                  )
                )
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "expense-users", className: "col-sm-5 control-label"}, "Split between:"), 
                React.createElement("div", {id: "expense-users", className: "col-sm-7"}, 
                  userCheckboxes
                )
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("div", {className: "align-center"}, 
                  React.createElement("button", {type: "submit", className: "btn btn-sm btn-success"}, React.createElement("i", {className: "glyphicon glyphicon-plus"}), " Add expense")
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = AddExpenseForm;

},{}],2:[function(require,module,exports){
var AddUserForm = React.createClass ({displayName: "AddUserForm",
  handleSubmit: function (e) {
    e.preventDefault ();

    var newUserName = React.findDOMNode(this.refs.newUserName).value.trim();
    if (!newUserName) return;
    React.findDOMNode(this.refs.newUserName).value = '';

    var newUser = {
      name: newUserName,
      key: window.userIndex++
    };
    return this.props.onAddUser (newUser);
  },
  render: function () {
    return (
      React.createElement("div", {className: "col-lg-12"}, 
        React.createElement("div", {className: "panel panel-default"}, 
          React.createElement("div", {className: "panel-body"}, 
            React.createElement("form", {onSubmit: this.handleSubmit}, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", {for: "add-user-input"}, "Add user"), 
                React.createElement("input", {type: "text", className: "form-control", ref: "newUserName", id: "add-user-input", placeholder: "User Name"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("div", {className: "align-center"}, 
                  React.createElement("button", {type: "submit", className: "btn btn-sm btn-success"}, React.createElement("i", {className: "glyphicon glyphicon-plus"}), " Add user")
                )
              )
            )
          )
        )
      )
    );
  }
});

module.exports = AddUserForm;

},{}],3:[function(require,module,exports){
'use strict';

var ClearAllForm = React.createClass ({displayName: "ClearAllForm",
  onClearAll: function (e) {
    e.preventDefault ();
    this.props.onClearAll ();
  },
  render: function () {
    return (
      React.createElement("div", {className: "col-lg-12"}, 
        React.createElement("div", {className: "panel panel-danger"}, 
          React.createElement("div", {className: "panel-heading"}, "Danger zone"), 
          React.createElement("div", {className: "panel-body"}, 
            React.createElement("form", {onSubmit: this.onClearAll}, 
              React.createElement("label", {className: "control-label"}, "Clear all data. This cannot be undone."), 
              React.createElement("button", {type: "submit", className: "btn btn-danger btn-sm"}, React.createElement("i", {className: "glyphicon glyphicon-ban-circle"}), " Clear all data")
            )
          )
        )
      )
    );
  },
});

module.exports = ClearAllForm;

},{}],4:[function(require,module,exports){
'use strict';

var ExpenseItem = React.createClass ({displayName: "ExpenseItem",
  getInitialState: function () {
    return {
      folded: this.props.folded || true
    };
  },
  onCheckUser: function (userKey, e) {
    this.props.checkExpenseUser (userKey, this.props.expense.key, e.target.checked);
  },
  toggleFolding: function () {
    var that = this;
    return this.setState ({
      folded: !that.state.folded 
   });
  },
  deleteExpense: function () {
    this.props.deleteExpense (this.props.expense.key);
  },
  render: function () {
    var expense = this.props.expense;
    var userName = this.props._users[expense.paidBy].name;

    var that = this;
    var users = this.props.users.map (function (user) {
      var isChecked = expense.splitBetween[user.key];
      return (
        React.createElement("div", {className: "checkbox"}, 
          React.createElement("label", null, 
            React.createElement("input", {type: "checkbox", checked: isChecked, onChange: that.onCheckUser.bind (that, user.key)}), 
            user.name
          )
        )
      );
    });

    var foldButtonClass = this.state.folded ? 'glyphicon glyphicon-chevron-down chevron-heading action-icon' : 'glyphicon glyphicon-chevron-up chevron-heading action-icon';
    var foldButton = React.createElement("i", {className: foldButtonClass, onClick: this.toggleFolding});

    var deleteButton = React.createElement("i", {className: "glyphicon glyphicon-remove action-icon", onClick: this.deleteExpense})

    var expenseContent;
    if (!this.state.folded) {
      expenseContent = (
        React.createElement("div", null, 
          React.createElement("p", null, foldButton, " "), 
          React.createElement("p", null, 
            React.createElement("b", null, "Amount:")
          ), 
          React.createElement("h2", null, "$ ", expense.amount), 
          React.createElement("hr", null), 
          React.createElement("p", null, 
            React.createElement("b", null, "Paid by:"), 
            React.createElement("span", null, " ", userName)
          ), 
          React.createElement("hr", null), 
          React.createElement("p", null, 
            React.createElement("b", null, "Share between:")
          ), 
          users
        )
      );
    } else {
      expenseContent = (
        React.createElement("div", null, 
          foldButton, "   ", React.createElement("b", null, "$", expense.amount), " paid by ", React.createElement("b", null, userName)
        )
      );
    }
    return (
      React.createElement("li", {className: "list-group-item"}, 
        React.createElement("span", {className: "delete-button"}, deleteButton), 
        expenseContent
      )
    );
  }
});

module.exports = ExpenseItem;

},{}],5:[function(require,module,exports){
'use strict';

var ExpenseItem = require ('./ExpenseItem.React.js');

var ExpenseList = React.createClass ({displayName: "ExpenseList",
  handleDeleteExpense: function (key) {
    return this.props.handleDeleteExpense (key);
  },
  checkExpenseUser: function () {
    this.props.checkExpenseUser.apply (this, arguments);
  },
  render: function () {
    var that = this;

    var expenseContents, foldButton;

    if (!this.props.users.length) {
      expenseContents = (
        React.createElement("div", {className: "panel-body"}, 
          React.createElement("span", null, "No user yet.")
        )
      );
    } else if (!this.props.expenses.length) {
      expenseContents = (
        React.createElement("div", {className: "panel-body"}, 
          React.createElement("span", null, "No expense yet.")
        )
      );
    } else {
      var that = this;
      var expenseList = this.props.expenses.map (function (expense, index) {
        return React.createElement(ExpenseItem, {
          expense: expense, 
          users: that.props.users, 
          _users: that.props._users, 
          checkExpenseUser: that.checkExpenseUser, 
          deleteExpense: that.handleDeleteExpense})
      });
      expenseContents = (
        React.createElement("ul", {className: "list-group"}, 
          expenseList
        )
      );
    }
    return (
      React.createElement("div", {className: "panel panel-info"}, 
        React.createElement("div", {className: "panel-heading"}, "Expenses"), 
        expenseContents
      )
    );
  }
});

module.exports = ExpenseList;

},{"./ExpenseItem.React.js":4}],6:[function(require,module,exports){
'use strict';

var AddUserForm = require ('./AddUserForm.React.js');
var AddExpenseForm = require ('./AddExpenseForm.React.js');
var UserList = require ('./UserList.React.js');
var ExpenseList = require ('./ExpenseList.React.js');
var TotalList = require ('./TotalList.React.js');
var ClearAllForm = require ('./ClearAllForm.React.js');

var ShareApp = React.createClass ({displayName: "ShareApp",
  getInitialState: function () {
    var savedState = this.loadState ();

    var users = this.props.users || savedState.users || [];
    var _users = this.props._users || savedState._users || {};
    var expenses = this.props.expenses || savedState.expenses || [];
    var _expenses = this.props._expenses || savedState._expenses || {};

    return {
      users: users,
      _users: _users,
      expenses: expenses,
      _expenses: _expenses
    };
  },
  handleAddUser: function (newUser) {
    var users = this.state.users;
    var _users = this.state._users;

    users.push (newUser);
    _users[newUser.key] = newUser;

    this.saveState ();

    return this.setState ({ users: users, _users: _users });
  },
  handleAddExpense: function (newExpense) {
    var expenses = this.state.expenses;
    var _expenses = this.state._expenses;
    expenses.push (newExpense);
    _expenses[newExpense.key] = newExpense;

    this.saveState ();

    return this.setState ({ expenses: expenses, _expenses: _expenses });
  },
  handleCheckExpenseUser: function handleCheckExpenseUser(userKey, expenseKey, isChecked) {
    var expenses = this.state.expenses;
    var _expenses = this.state._expenses;
    var expense = _expenses[expenseKey];

    if (isChecked) {
      expense.splitBetween[userKey] = true;
    } else {
      delete expense.splitBetween[userKey];
    }
    _expenses[expenseKey] = expense;

    var expenseIndex = -1;
    expenses.some (function (expense, index) {
      if (expense.key !== expenseKey) return;
      expenseIndex = index;
      return;
    });

    if (expenseIndex !== -1) {
      expenses.splice(expenseIndex, 1, expense);
    }

    this.saveState ();

    return this.setState({ expenses: expenses, _expenses: _expenses });
  },
  handleDeleteExpense: function (key) {
    var _expenses = this.state._expenses;

    delete _expenses[key];

    var stateUpdater = { _expenses: _expenses };

    var expenseIndex = -1;
    this.state.expenses.some (function (expense, index) {
      if (expense.key !== key) return;
      expenseIndex = index;
      return;
    });
    if (expenseIndex !== -1) {
      var expenses = this.state.expenses;
      expenses.splice (expenseIndex, 1);
      stateUpdater.expenses = expenses;
    }

    this.setState (stateUpdater);
    return this.saveState ();
  },
  handleDeleteUser: function (userKey) {
    if (!this.state._users[userKey]) return;

    var expenses = this.state.expenses;
    _.remove (expenses, function (expense) {
      return expense.paidBy === userKey;
    });
    expenses.forEach (function (expense) {
      delete expense.splitBetween[userKey];
    });

    var users = this.state.users;
    _.remove (users, function (user) {
      return user.key === userKey;
    });
    var _users = this.state._users;
    delete _users[userKey];

    this.saveState ();

    return this.setState ({
      expenses: expenses,
      users: users,
      _users: _users
    });
  },
  handleClearAll: function () {
    userIndex = 0;
    expenseIndex = 0;
    this.setState ({
      users: [],
      _users: {},
      expenses: [],
      _expenses: {}
    });
    return localStorage.setItem ('se:state', {});
  },
  saveState: function () {
    return localStorage.setItem ('se:state', JSON.stringify (this.state));
  },
  loadState: function () {
    var savedState = localStorage.getItem ('se:state');
    if (!savedState) return {};

    try {
      savedState = JSON.parse (savedState);
    } catch (e) {
      savedState = {};
    }

    return savedState || {};
  },
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-lg-3"}, 
            React.createElement("div", {className: "row"}, 
              React.createElement(AddUserForm, {onAddUser: this.handleAddUser})
            ), 
            React.createElement("div", {className: "row"}, 
              React.createElement(AddExpenseForm, {users: this.state.users, onAddExpense: this.handleAddExpense})
            ), 
            React.createElement("div", {className: "row"}, 
              React.createElement(ClearAllForm, {onClearAll: this.handleClearAll})
            )
          ), 
          React.createElement("div", {className: "col-lg-3"}, 
            React.createElement(UserList, {users: this.state.users, handleDeleteUser: this.handleDeleteUser})
          ), 
          React.createElement("div", {className: "col-lg-3"}, 
            React.createElement(ExpenseList, {
              users: this.state.users, 
              _users: this.state._users, 
              expenses: this.state.expenses, 
              checkExpenseUser: this.handleCheckExpenseUser, 
              handleDeleteExpense: this.handleDeleteExpense})
          ), 
          React.createElement("div", {className: "col-lg-3"}, 
            React.createElement(TotalList, {users: this.state.users, _users: this.state._users, expenses: this.state.expenses})
          )
        ), 
        React.createElement("div", {className: "row"}
        )
      )
    );
  }
});

window.userIndex = 0;
window.expenseIndex = 0;

React.render (
  React.createElement(ShareApp, null),
  document.getElementById ('share-app')
);

},{"./AddExpenseForm.React.js":1,"./AddUserForm.React.js":2,"./ClearAllForm.React.js":3,"./ExpenseList.React.js":5,"./TotalList.React.js":7,"./UserList.React.js":8}],7:[function(require,module,exports){
'use strict';

var TotalList = React.createClass ({displayName: "TotalList",
  computeWhoOwes: function () {
    var balances = {};

    var that = this;

    this.props.users.forEach (function (payer) {
      balances[payer.key] = {};
      that.props.users.forEach (function (ower) {
        if (ower.key === payer.key) return;
        balances[payer.key][ower.key] = 0;
      });
    });

    this.props.expenses.forEach (function (expense) {
      if (!_.keys (expense.splitBetween).length) return;

      var share = expense.amount / (_.keys (expense.splitBetween).length || that.props.users.length);
      _.keys (expense.splitBetween).forEach (function (userKey) {
        if (parseInt (userKey) === expense.paidBy) return;
        balances[expense.paidBy][userKey] += share;
        balances[userKey][expense.paidBy] -= share;
      });
    });

    return balances;
  },
  render: function () {
    var that = this;

    var summaryContent;

    if (!this.props.users.length) {
      summaryContent = (
        React.createElement("div", {className: "panel-body"}, "No user yet.")
      );
    } else if (!this.props.expenses.length) {
      summaryContent = (
        React.createElement("div", {className: "panel-body"}, "No expense yet.")
      );
    } else {
      var balances = this.computeWhoOwes ();

      var totals = [];
      _.forEach (balances, function (amounts, payerKey) {
        var payerName = that.props._users[payerKey].name;
        _.forEach (amounts, function (amount, owerKey) {
          var owerName = that.props._users[owerKey].name;
          if (amount >= 0) return;
          totals.push (
            React.createElement("li", {className: "list-group-item"}, 
              React.createElement("b", null, payerName), " owes ", React.createElement("b", null, "$", -amount.toFixed (2)), " to ", React.createElement("b", null, owerName)
            )
          );
        });
      });
      if (!totals.length) {
        summaryContent = React.createElement("div", {className: "panel-body"}, "All set !");
      } else {
        summaryContent = (
          React.createElement("ul", {className: "list-group"}, 
            totals
          )
        );
      }
    }

    return (
      React.createElement("div", {className: "panel panel-info"}, 
        React.createElement("div", {className: "panel-heading"}, "Summary"), 
        summaryContent
      )
    );
  }
});

module.exports = TotalList;

},{}],8:[function(require,module,exports){
'use strict';

var UserList = React.createClass ({displayName: "UserList",
  handleDeleteUser: function (key) {
    return this.props.handleDeleteUser (key);
  },
  render: function () {
    var userContent;
    var that = this;
    if (this.props.users.length) {
      var userList = this.props.users.map (function (user) {
        return (
          React.createElement("li", {className: "list-group-item", key: user.key}, 
            user.name, 
            React.createElement("span", {className: "delete-button"}, 
              React.createElement("i", {className: "glyphicon glyphicon-remove action-icon", onClick: that.handleDeleteUser.bind (that, user.key)})
            )
          )
        );
      });
      userContent = (
        React.createElement("ul", {className: "list-group"}, 
          userList
        )
      );
    } else {
      userContent = (
        React.createElement("div", {className: "panel-body"}, 
          "No user yet."
        )
      );
    }
    return (
      React.createElement("div", {className: "panel panel-info"}, 
        React.createElement("div", {className: "panel-heading"}, "Users"), 
        userContent
      )
    );
  }
});

module.exports = UserList;

},{}]},{},[6]);
