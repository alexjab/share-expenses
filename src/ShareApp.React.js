'use strict';

var ShareApp = React.createClass ({
  getInitialState: function () {
    var users = this.props.users || [];
    var _users = this.props._users || {};
    var expenses = this.props.expenses || [];

    return {
      users: users,
      _users: _users,
      expenses: expenses
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
  handleCheckExpenseUser: function handleCheckExpenseUser(userKey, expenseKey, isChecked) {
    var expenses = this.state.expenses;
    var expense = expenses[expenseKey];

    if (isChecked) {
      expense.splitBetween[userKey] = true;
    } else {
      delete expense.splitBetween[userKey];
    }

    expenses.splice(expenseKey, 1, expense);
    return this.setState({ expenses: expenses });
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
          </div>
          <div className="col-lg-3">
            <UserList users={this.state.users} />
          </div>
          <div className="col-lg-3">
            <ExpenseList users={this.state.users} _users={this.state._users} expenses={this.state.expenses} onCheckExpenseUser={this.handleCheckExpenseUser}/>
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

var AddUserForm = React.createClass ({
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
    return (
      <div className="col-lg-12">
        <div className="panel panel-default">
          <div className="panel-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label for="add-user-input">Add user</label>
                <input type="text" className="form-control" ref="newUserName" id="add-user-input" placeholder="User Name" />
              </div>
              <div className="form-group">
                <div className="align-center">
                  <button type="submit" className="btn btn-sm btn-success"><i className="glyphicon glyphicon-plus"></i> Add user</button>
                </div>
              </div>
            </form>
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

    React.findDOMNode(this.refs.newExpenseAmount).value = null;
    React.findDOMNode(this.refs.newExpensePayer).value = this.props.users[0].key;
    this.props.users.forEach (function (user) {
      React.findDOMNode(that.refs['payer' + user.key]).checked = false;
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
      <div className="col-lg-12">
        <div className="panel panel-default">
          <div className="panel-body">
            <p>
              <b>Add expense</b>
            </p>
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
              <div className="form-group">
                <div className="align-center">
                  <button type="submit" className="btn btn-sm btn-success"><i className="glyphicon glyphicon-plus"></i> Add expense</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

var UserList = React.createClass ({
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
      <div className="panel panel-info">
        <div className="panel-heading">Users</div>
        {userContent}
      </div>
    );
  }
});

var ExpenseList = React.createClass ({
  render: function () {
    var that = this;

    var expenseContents, foldButton;

    if (!this.props.users.length) {
      expenseContents = (
        <div className="panel-body">
          <span>No user yet.</span>
        </div>
      );
    } else if (!this.props.expenses.length) {
      expenseContents = (
        <div className="panel-body">
          <span>No expense yet.</span>
        </div>
      );
    } else {
      var that = this;
      var expenseList = this.props.expenses.map (function (expense, index) {
        return <ExpenseItem
          expense={expense}
          users={that.props.users}
          _users={that.props._users}
          checkExpenseUser={that.onCheckExpenseUser} />
      });
      expenseContents = (
        <ul className="list-group">
          {expenseList}
        </ul>
      );
    }
    return (
      <div className="panel panel-info">
        <div className="panel-heading">Expenses</div>
        {expenseContents}
      </div>
    );
  }
});

var ExpenseItem = React.createClass ({
  getInitialState: function () {
    return {
      folded: this.props.folded || false
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

    var foldButtonClass = this.state.folded ? 'glyphicon glyphicon-chevron-down chevron-heading' : 'glyphicon glyphicon-chevron-up chevron-heading';
    var foldButton = <i className={foldButtonClass} onClick={this.toggleFolding}></i>;

    var deleteButton = <i className="glyphicon glyphicon-trash"></i>

    var expenseContent;
    if (!this.state.folded) {
      expenseContent = (
        <div>
          <p>
            {deleteButton} <b>Amount:</b>
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
        </div>
      );
    } else {
      expenseContent = (
        <div>
          {deleteButton} <b>${expense.amount}</b> paid by <b>{userName}</b>
        </div>
      );
    }
    return (
      <li className="list-group-item">
        <span className="fold-button">{foldButton}</span>
        {expenseContent}
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
    var that = this;

    var summaryContent;

    if (!this.props.users.length) {
      summaryContent = (
        <div className="panel-body">No user yet.</div>
      );
    } else if (!this.props.expenses.length) {
      summaryContent = (
        <div className="panel-body">No expense yet.</div>
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
            <li className="list-group-item">
              <b>{payerName}</b> owes <b>${-amount}</b> to <b>{owerName}</b>
            </li>
          );
        });
      });
      summaryContent = (
        <ul className="list-group">
          {totals}
        </ul>
      );
    }

    return (
      <div className="panel panel-info">
        <div className="panel-heading">Summary</div>
        {summaryContent}
      </div>
    );
  }
});

var userIndex = 0;
var expenseIndex = 0;

var USERS = [{
  name: 'Jon',
  key: userIndex++
}, {
  name: 'Arya',
  key: userIndex++
}, {
  name: 'Tyrion',
  key: userIndex++
}, {
  name: 'Jaime',
  key: userIndex++
}];

var EXPENSES = [{
  key: expenseIndex++,
  paidBy: 1,
  amount: 12,
  splitBetween: {
    0: true,
    2: true,
  }
}, {
  key: expenseIndex++,
  paidBy: 3,
  amount: 24,
  splitBetween: {
    0: true,
    2: true,
    3: true,
  }
}, {
  key: expenseIndex++,
  paidBy: 2,
  amount: 20,
  splitBetween: {
    1: true,
    2: true,
  }
}];

var _USERS = _.indexBy (USERS, 'key');

React.render (
  <ShareApp users={USERS} _users={_USERS} expenses={EXPENSES}/>,
  document.getElementById ('share-app')
);

