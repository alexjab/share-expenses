'use strict';

var ShareApp = React.createClass ({
  getInitialState: function () {
    var savedState = this.loadState ();

    var users = this.props.users || savedState.users || [];
    var _users = this.props._users || savedState._users || {};
    var expenses = this.props.expenses || savedState.expenses || [];

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

    this.saveState ();

    return this.setState ({ users: users, _users: _users });
  },
  handleAddExpense: function (newExpense) {
    var expenses = this.state.expenses;
    expenses.push (newExpense);

    this.saveState ();

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

    this.saveState ();

    return this.setState({ expenses: expenses });
  },
  handleDeleteExpense: function (key) {
    var expenseIndex = -1;
    this.state.expenses.some (function (expense, index) {
      if (expense.key !== key) return;
      expenseIndex = index;
      return;
    });
    if (expenseIndex !== -1) {
      var expenses = this.state.expenses;
      expenses.splice (expenseIndex, 1);
      this.setState ({ expenses: expenses });

      this.saveState ();
    }
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
      expenses: []
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
      React.findDOMNode(that.refs['payer' + user.key]).checked = true;
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
            <input type="checkbox" ref={'payer' + user.key} defaultChecked={true} />
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
  handleDeleteUser: function (key) {
    return this.props.handleDeleteUser (key);
  },
  render: function () {
    var userContent;
    var that = this;
    if (this.props.users.length) {
      var userList = this.props.users.map (function (user) {
        return (
          <li className="list-group-item" key={user.key}>
            {user.name}
            <span className="delete-button">
              <i className="glyphicon glyphicon-remove action-icon" onClick={that.handleDeleteUser.bind (that, user.key)}></i>
            </span>
          </li>
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
          checkExpenseUser={that.checkExpenseUser}
          deleteExpense={that.handleDeleteExpense}/>
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
        <div className="checkbox">
          <label>
            <input type="checkbox" checked={isChecked} onChange={that.onCheckUser.bind (that, user.key)}/>
            {user.name}
          </label>
        </div>
      );
    });

    var foldButtonClass = this.state.folded ? 'glyphicon glyphicon-chevron-down chevron-heading action-icon' : 'glyphicon glyphicon-chevron-up chevron-heading action-icon';
    var foldButton = <i className={foldButtonClass} onClick={this.toggleFolding}></i>;

    var deleteButton = <i className="glyphicon glyphicon-remove action-icon" onClick={this.deleteExpense}></i>

    var expenseContent;
    if (!this.state.folded) {
      expenseContent = (
        <div>
          <p>{foldButton} </p>
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
        </div>
      );
    } else {
      expenseContent = (
        <div>
          {foldButton} &nbsp; <b>${expense.amount}</b> paid by <b>{userName}</b>
        </div>
      );
    }
    return (
      <li className="list-group-item">
        <span className="delete-button">{deleteButton}</span>
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
      if (!totals.length) {
        summaryContent = <div className="panel-body">All set !</div>;
      } else {
        summaryContent = (
          <ul className="list-group">
            {totals}
          </ul>
        );
      }
    }

    return (
      <div className="panel panel-info">
        <div className="panel-heading">Summary</div>
        {summaryContent}
      </div>
    );
  }
});

var ClearAllForm = React.createClass ({
  onClearAll: function (e) {
    e.preventDefault ();
    this.props.onClearAll ();
  },
  render: function () {
    return (
      <div className="col-lg-12">
        <div className="panel panel-danger">
          <div className="panel-heading">Danger zone</div>
          <div className="panel-body">
            <form onSubmit={this.onClearAll}>
              <label className="control-label">Clear all data. This cannot be undone.</label>
              <button type="submit" className="btn btn-danger btn-sm"><i className="glyphicon glyphicon-ban-circle"></i> Clear all data</button>
            </form>
          </div>
        </div>
      </div>
    );
  },
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
  //<ShareApp users={USERS} _users={_USERS} expenses={EXPENSES} />,
  <ShareApp />,
  document.getElementById ('share-app')
);

