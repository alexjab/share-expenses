'use strict';

var AddUserForm = require ('./AddUserForm.React.js');
var AddExpenseForm = require ('./AddExpenseForm.React.js');
var UserList = require ('./UserList.React.js');
var ExpenseList = require ('./ExpenseList.React.js');
var TotalList = require ('./TotalList.React.js');
var ClearAllForm = require ('./ClearAllForm.React.js');

var ShareApp = React.createClass ({
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
      <div>
        <div className="row">
          <div className="col-lg-3">
            <div className="row">
              <AddUserForm onAddUser={this.handleAddUser} />
            </div>
            <div className="row">
              <AddExpenseForm users={this.state.users} onAddExpense={this.handleAddExpense} />
            </div>
            <div className="row">
              <ClearAllForm onClearAll={this.handleClearAll} />
            </div>
          </div>
          <div className="col-lg-3">
            <UserList users={this.state.users} handleDeleteUser={this.handleDeleteUser}/>
          </div>
          <div className="col-lg-3">
            <ExpenseList
              users={this.state.users}
              _users={this.state._users}
              expenses={this.state.expenses}
              checkExpenseUser={this.handleCheckExpenseUser}
              handleDeleteExpense={this.handleDeleteExpense} />
          </div>
          <div className="col-lg-3">
            <TotalList users={this.state.users} _users={this.state._users} expenses={this.state.expenses}/>
          </div>
        </div>
        <div className="row">
        </div>
      </div>
    );
  }
});

window.userIndex = 0;
window.expenseIndex = 0;

React.render (
  <ShareApp />,
  document.getElementById ('share-app')
);

