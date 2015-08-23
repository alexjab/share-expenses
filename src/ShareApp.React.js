'use strict';

var ShareApp = React.createClass ({
  getInitialState: function () {
    return {
      users: [],
      _users: {},
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
  render: function () {
    return (
      <div>
        <div className="row">
          <UserList users={this.state.users} onAddUser={this.handleAddUser}/>
          <ExpenseList users={this.state.users} _users={this.state._users} expenses={this.state.expenses} />
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
      key: index++
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
  render: function () {
    var that = this;

    if (!this.props.users.length) {
      return (<span></span>);
    }

    var expenseContents;

    if (!this.props.expenses.length) {
      expenseContents = (
        <div className="panel-body">
          No expense yet.
        </div>
      );
    } else {
      var expenseList = this.props.expenses.map (function (expense) {
        return (<ExpenseItem users={that.props.users} _users={that.props._users} expense={expense}/>);
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
  handleOnSubmit: function (e) {
    e.preventDefault ();
    this.props.onAddExpense ();
  },
  render: function () {
    var userOptions = this.props.users.map (function (user) {
      return <option value={user.key}>{user.name}</option>;
    });
    var userCheckboxes = this.props.users.map (function (user) {
      return (
        <div className="checkbox">
          <label>
            <input type="checkbox" />
            {user.name}
          </label>
        </div>
      );
    });
    var addExpenseContent;
    if (!userOptions.length) {
      return (<span></span>);
    }
    return (
      <form className="form-horizontal" onSubmit={this.handleOnSubmit}>
        <div className="form-group">
          <label for="expense-amount" className="col-sm-5 control-label">Amount:</label>
          <div className="col-sm-7">
            <input type="number" className="form-control" id="expense-amount" placeholder="Amount" />
          </div>
        </div>
        <div className="form-group">
          <label for="expense-payer" className="col-sm-5 control-label">Who paid:</label>
          <div className="col-sm-7">
            <select className="form-control" id="expense-payer">
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
  render: function () {
    var expense = this.props.expense;
    var userName = this.props._users[expense.payer].name;
    var users = this.props.users.map (function (user) {
      return (
        <div className="checkbox">
          <label>
            <input type="checkbox" />
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
        <input type="text" className="form-control" defaultValue={expense.amount} placeholder="Amount"/>
        <hr />
        <p>
          <b>Paid by:</b>
        </p>
        <span>{userName}</span>
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
  render: function () {
    var that = this;
    if (!this.props.users.length) {
      return (<span></span>);
    }

    if (!this.props.expenses.length) {
      return (<span></span>);
    }

    var totalContents;
    var totals = [];
    this.props.users.forEach (function (ower) {
      that.props.users.forEach (function (owed) {
        totals.push (
          <li className="list-group-item">{ower.name} owes €X to {owed.name}</li>
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

var index = 0;

React.render (
  <ShareApp />,
  document.getElementById ('share-app')
);
