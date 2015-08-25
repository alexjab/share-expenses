'use strict';

var ShareApp = React.createClass ({
  getInitialState: function () {
    return {
      users: [{name: 'Alex', key: 0}],
      _users: {'0':{name: 'Alex', key: 0}},
      expenses: []
    };
  },
  handleAddUser: function (newUser) {
    var users = this.state.users;
    var _users = this.state._users;

    users.push (newUser);
    _users[newUser.key] = newUser;

    return this.setState ({ users: users, _users: _users });
  },
  handleAddExpense: function (newExpense) {
    var expenses = this.state.expenses;
    expenses.push (newExpense);

    return this.setState ({ expenses: expenses });
  },
  handleCheckExpenseUser: function (userKey, expenseKey, isChecked) {
    var expenses = this.state.expenses;
    var expense = expenses[expenseKey];

    if (isChecked) {
      expense.splitBetween[userKey] = true;
    } else {
      delete expense.splitBetween[userKey];
    }

    expenses.splice (expenseKey, 1, expense);
    return this.setState ({ expenses: expenses });
  },
  render: function () {
    return (
      <div>
        <div className="row">
          <UserList users={this.state.users} onAddUser={this.handleAddUser}/>
          <ExpenseList users={this.state.users} _users={this.state._users} expenses={this.state.expenses} onAddExpense={this.handleAddExpense} onCheckExpenseUser={this.handleCheckExpenseUser}/>
          <TotalList users={this.state.users} _users={this.state._users} expenses={this.state.expenses}/>
        </div>
      </div>
    );
  }
});

var UserList = React.createClass ({
  handleSubmit: function (e) {
    e.preventDefault ();

    var newUserName = React.findDOMNode(this.refs.newUserName).value.trim();
    if (!newUserName) return;
    React.findDOMNode(this.refs.newUserName).value = '';

    var newUser = {
      name: newUserName,
      key: userIndex++
    };
    return this.props.onAddUser (newUser);
  },
  render: function () {
    var userContent;
    if (this.props.users.length) {
      var userList = this.props.users.map (function (user) {
        return (
          <li className="list-group-item" key={user.key}>{user.name}</li>
        );
      });
      userContent = (
        <ul className="list-group">
          {userList}
        </ul>
      );
    } else {
      userContent = (
        <div className="panel-body">
          No user yet.
        </div>
      );
    }
    return (
      <div className="col-lg-3">
        <div className="panel panel-info">
          <div className="panel-heading">Users</div>
          {userContent}
        </div>
        <div className="panel panel-default">
          <div className="panel-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label for="add-user-input">Add user</label>
                <input type="text" className="form-control" ref="newUserName" id="add-user-input" placeholder="User Name" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

var ExpenseList = React.createClass ({
  onAddExpense: function (expense) {
    return this.props.onAddExpense (expense);
  },
  onCheckExpenseUser: function () {
    return this.props.onCheckExpenseUser.apply (this, arguments);
  },
  render: function () {
    var that = this;

    if (!this.props.users.length) {
      return (<span></span>);
    }

    var expenseContents;

    if (!this.props.expenses.length) {
      expenseContents = (
        <div className="panel-body">
          <span>No expense yet.</span>
        </div>
      );
    } else {
      var expenseList = this.props.expenses.map (function (expense) {
        return <ExpenseItem expense={expense} users={that.props.users} _users={that.props._users} checkExpenseUser={that.onCheckExpenseUser}/>
      });
      expenseContents = (
        <ul className="list-group">
          {expenseList}
        </ul>
      );
    }
    return (
      <div className="col-lg-4">
        <div className="panel panel-info">
          <div className="panel-heading">Expenses</div>
          {expenseContents}
        </div>
        <div className="panel panel-default">
          <div className="panel-body">
            <p>
              <b>Add expense</b>
            </p>
            <AddExpenseForm users={this.props.users} onAddExpense={this.onAddExpense}/>
          </div>
        </div>
      </div>
    );
  }
});

var AddExpenseForm = React.createClass ({
  getInitialState: function () {
    return { splitBetween: {} };
  },
  handleOnSubmit: function (e) {
    e.preventDefault ();

    var newExpense = {};
    newExpense.key = expenseIndex++;
    newExpense.amount = parseFloat (React.findDOMNode(this.refs.newExpenseAmount).value.trim());
    newExpense.paidBy = parseFloat (React.findDOMNode(this.refs.newExpensePayer).value.trim());
    newExpense.splitBetween = {};

    var that = this;
    this.props.users.forEach (function (user) {
      var isChecked = React.findDOMNode(that.refs['payer' + user.key]).checked;
      if (isChecked) newExpense.splitBetween[user.key] = true;
    });

    return this.props.onAddExpense (newExpense);
  },
  render: function () {
    var userOptions = this.props.users.map (function (user) {
      return <option value={user.key}>{user.name}</option>;
    });
    var that = this;
    var userCheckboxes = this.props.users.map (function (user) {
      return (
        <div className="checkbox">
          <label>
            <input type="checkbox" ref={'payer' + user.key}/>
            {user.name}
          </label>
        </div>
      );
    });
    if (!userOptions.length) {
      return (<span></span>);
    }
    return (
      <form className="form-horizontal" onSubmit={this.handleOnSubmit}>
        <div className="form-group">
          <label for="expense-amount" className="col-sm-5 control-label">Amount:</label>
          <div className="col-sm-7">
            <input type="number" className="form-control" ref="newExpenseAmount" id="expense-amount" placeholder="Amount" />
          </div>
        </div>
        <div className="form-group">
          <label for="expense-payer" className="col-sm-5 control-label">Who paid:</label>
          <div className="col-sm-7">
            <select className="form-control" ref="newExpensePayer" id="expense-payer">
              {userOptions}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label for="expense-users" className="col-sm-5 control-label">Split between:</label>
          <div id="expense-users" className="col-sm-7">
            {userCheckboxes}
          </div>
        </div>
        <hr />
        <div className="form-group">
          <div className="align-center">
            <button type="submit" className="btn btn-sm btn-success"><i className="glyphicon glyphicon-plus"></i>Add expense</button>
          </div>
        </div>
      </form>
    );
  }
});

var ExpenseItem = React.createClass ({
  onCheckUser: function (userKey, e) {
    this.props.checkExpenseUser (userKey, this.props.expense.key, e.target.checked);
  },
  render: function () {
    var expense = this.props.expense;
    var userName = this.props._users[expense.paidBy].name;

    var that = this;
    var users = this.props.users.map (function (user) {
      var isChecked = expense.splitBetween[user.key];
      return (
        <div className="checkbox">
          <label>
            <input type="checkbox" checked={isChecked} onChange={that.onCheckUser.bind (that, user.key)}/>
            {user.name}
          </label>
        </div>
      );
    });

    return (
      <li className="list-group-item">
        <p>
          <b>Amount:</b>
        </p>
        <h2>$ {expense.amount}</h2>
        <hr />
        <p>
          <b>Paid by:</b>
          <span> {userName}</span>
        </p>
        <hr />
        <p>
          <b>Share between:</b>
        </p>
        {users}
      </li>
    );
  }
});

var TotalList = React.createClass ({
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
    var balances = this.computeWhoOwes ();

    var that = this;
    if (!this.props.users.length) {
      return (<span></span>);
    }

    if (!this.props.expenses.length) {
      return (<span></span>);
    }

    var totals = [];
    _.forEach (balances, function (amounts, payerKey) {
      var payerName = that.props._users[payerKey].name;
      _.forEach (amounts, function (amount, owerKey) {
        var owerName = that.props._users[owerKey].name;
        if (amount >= 0) return;
        totals.push (
          <li className="list-group-item">{payerName} owes $ {-amount} to {owerName}</li>
        );
      });
    });
    return (
      <div className="col-lg-4">
        <div className="panel panel-info">
          <div className="panel-heading">Summary</div>
          <ul className="list-group">
            {totals}
          </ul>
        </div>
      </div>
    );
  }
});

var userIndex = 1;
var expenseIndex = 0;

React.render (
  <ShareApp />,
  document.getElementById ('share-app')
);
