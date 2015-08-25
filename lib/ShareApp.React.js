'use strict';

var ShareApp = React.createClass({
  displayName: 'ShareApp',

  getInitialState: function getInitialState() {
    return {
      users: [{ name: 'Alex', key: 0 }],
      _users: { '0': { name: 'Alex', key: 0 } },
      expenses: []
    };
  },
  handleAddUser: function handleAddUser(newUser) {
    var users = this.state.users;
    var _users = this.state._users;

    users.push(newUser);
    _users[newUser.key] = newUser;

    return this.setState({ users: users, _users: _users });
  },
  handleAddExpense: function handleAddExpense(newExpense) {
    var expenses = this.state.expenses;
    expenses.push(newExpense);

    return this.setState({ expenses: expenses });
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
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(UserList, { users: this.state.users, onAddUser: this.handleAddUser }),
        React.createElement(ExpenseList, { users: this.state.users, _users: this.state._users, expenses: this.state.expenses, onAddExpense: this.handleAddExpense, onCheckExpenseUser: this.handleCheckExpenseUser }),
        React.createElement(TotalList, { users: this.state.users, _users: this.state._users, expenses: this.state.expenses })
      )
    );
  }
});

var UserList = React.createClass({
  displayName: 'UserList',

  handleSubmit: function handleSubmit(e) {
    e.preventDefault();

    var newUserName = React.findDOMNode(this.refs.newUserName).value.trim();
    if (!newUserName) return;
    React.findDOMNode(this.refs.newUserName).value = '';

    var newUser = {
      name: newUserName,
      key: userIndex++
    };
    return this.props.onAddUser(newUser);
  },
  render: function render() {
    var userContent;
    if (this.props.users.length) {
      var userList = this.props.users.map(function (user) {
        return React.createElement(
          'li',
          { className: 'list-group-item', key: user.key },
          user.name
        );
      });
      userContent = React.createElement(
        'ul',
        { className: 'list-group' },
        userList
      );
    } else {
      userContent = React.createElement(
        'div',
        { className: 'panel-body' },
        'No user yet.'
      );
    }
    return React.createElement(
      'div',
      { className: 'col-lg-3' },
      React.createElement(
        'div',
        { className: 'panel panel-info' },
        React.createElement(
          'div',
          { className: 'panel-heading' },
          'Users'
        ),
        userContent
      ),
      React.createElement(
        'div',
        { className: 'panel panel-default' },
        React.createElement(
          'div',
          { className: 'panel-body' },
          React.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement(
                'label',
                { 'for': 'add-user-input' },
                'Add user'
              ),
              React.createElement('input', { type: 'text', className: 'form-control', ref: 'newUserName', id: 'add-user-input', placeholder: 'User Name' })
            )
          )
        )
      )
    );
  }
});

var ExpenseList = React.createClass({
  displayName: 'ExpenseList',

  onAddExpense: function onAddExpense(expense) {
    return this.props.onAddExpense(expense);
  },
  onCheckExpenseUser: function onCheckExpenseUser() {
    return this.props.onCheckExpenseUser.apply(this, arguments);
  },
  render: function render() {
    var that = this;

    if (!this.props.users.length) {
      return React.createElement('span', null);
    }

    var expenseContents;

    if (!this.props.expenses.length) {
      expenseContents = React.createElement(
        'div',
        { className: 'panel-body' },
        React.createElement(
          'span',
          null,
          'No expense yet.'
        )
      );
    } else {
      var expenseList = this.props.expenses.map(function (expense) {
        return React.createElement(ExpenseItem, { expense: expense, users: that.props.users, _users: that.props._users, checkExpenseUser: that.onCheckExpenseUser });
      });
      expenseContents = React.createElement(
        'ul',
        { className: 'list-group' },
        expenseList
      );
    }
    return React.createElement(
      'div',
      { className: 'col-lg-4' },
      React.createElement(
        'div',
        { className: 'panel panel-info' },
        React.createElement(
          'div',
          { className: 'panel-heading' },
          'Expenses'
        ),
        expenseContents
      ),
      React.createElement(
        'div',
        { className: 'panel panel-default' },
        React.createElement(
          'div',
          { className: 'panel-body' },
          React.createElement(
            'p',
            null,
            React.createElement(
              'b',
              null,
              'Add expense'
            )
          ),
          React.createElement(AddExpenseForm, { users: this.props.users, onAddExpense: this.onAddExpense })
        )
      )
    );
  }
});

var AddExpenseForm = React.createClass({
  displayName: 'AddExpenseForm',

  getInitialState: function getInitialState() {
    return { splitBetween: {} };
  },
  handleOnSubmit: function handleOnSubmit(e) {
    e.preventDefault();

    var newExpense = {};
    newExpense.key = expenseIndex++;
    newExpense.amount = parseFloat(React.findDOMNode(this.refs.newExpenseAmount).value.trim());
    newExpense.paidBy = parseFloat(React.findDOMNode(this.refs.newExpensePayer).value.trim());
    newExpense.splitBetween = {};

    var that = this;
    this.props.users.forEach(function (user) {
      var isChecked = React.findDOMNode(that.refs['payer' + user.key]).checked;
      if (isChecked) newExpense.splitBetween[user.key] = true;
    });

    return this.props.onAddExpense(newExpense);
  },
  render: function render() {
    var userOptions = this.props.users.map(function (user) {
      return React.createElement(
        'option',
        { value: user.key },
        user.name
      );
    });
    var that = this;
    var userCheckboxes = this.props.users.map(function (user) {
      return React.createElement(
        'div',
        { className: 'checkbox' },
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'checkbox', ref: 'payer' + user.key }),
          user.name
        )
      );
    });
    if (!userOptions.length) {
      return React.createElement('span', null);
    }
    return React.createElement(
      'form',
      { className: 'form-horizontal', onSubmit: this.handleOnSubmit },
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          { 'for': 'expense-amount', className: 'col-sm-5 control-label' },
          'Amount:'
        ),
        React.createElement(
          'div',
          { className: 'col-sm-7' },
          React.createElement('input', { type: 'number', className: 'form-control', ref: 'newExpenseAmount', id: 'expense-amount', placeholder: 'Amount' })
        )
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          { 'for': 'expense-payer', className: 'col-sm-5 control-label' },
          'Who paid:'
        ),
        React.createElement(
          'div',
          { className: 'col-sm-7' },
          React.createElement(
            'select',
            { className: 'form-control', ref: 'newExpensePayer', id: 'expense-payer' },
            userOptions
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          { 'for': 'expense-users', className: 'col-sm-5 control-label' },
          'Split between:'
        ),
        React.createElement(
          'div',
          { id: 'expense-users', className: 'col-sm-7' },
          userCheckboxes
        )
      ),
      React.createElement('hr', null),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'div',
          { className: 'align-center' },
          React.createElement(
            'button',
            { type: 'submit', className: 'btn btn-sm btn-success' },
            React.createElement('i', { className: 'glyphicon glyphicon-plus' }),
            'Add expense'
          )
        )
      )
    );
  }
});

var ExpenseItem = React.createClass({
  displayName: 'ExpenseItem',

  onCheckUser: function onCheckUser(userKey, e) {
    this.props.checkExpenseUser(userKey, this.props.expense.key, e.target.checked);
  },
  render: function render() {
    var expense = this.props.expense;
    var userName = this.props._users[expense.paidBy].name;

    var that = this;
    var users = this.props.users.map(function (user) {
      var isChecked = expense.splitBetween[user.key];
      return React.createElement(
        'div',
        { className: 'checkbox' },
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'checkbox', checked: isChecked, onChange: that.onCheckUser.bind(that, user.key) }),
          user.name
        )
      );
    });

    return React.createElement(
      'li',
      { className: 'list-group-item' },
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Amount:'
        )
      ),
      React.createElement(
        'h2',
        null,
        '$ ',
        expense.amount
      ),
      React.createElement('hr', null),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Paid by:'
        ),
        React.createElement(
          'span',
          null,
          ' ',
          userName
        )
      ),
      React.createElement('hr', null),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Share between:'
        )
      ),
      users
    );
  }
});

var TotalList = React.createClass({
  displayName: 'TotalList',

  computeWhoOwes: function computeWhoOwes() {
    var balances = {};

    var that = this;

    this.props.users.forEach(function (payer) {
      balances[payer.key] = {};
      that.props.users.forEach(function (ower) {
        if (ower.key === payer.key) return;
        balances[payer.key][ower.key] = 0;
      });
    });

    this.props.expenses.forEach(function (expense) {
      var share = expense.amount / (_.keys(expense.splitBetween).length || that.props.users.length);
      _.keys(expense.splitBetween).forEach(function (userKey) {
        if (parseInt(userKey) === expense.paidBy) return;
        balances[expense.paidBy][userKey] += share;
        balances[userKey][expense.paidBy] -= share;
      });
    });
    return balances;
  },
  render: function render() {
    var balances = this.computeWhoOwes();

    var that = this;
    if (!this.props.users.length) {
      return React.createElement('span', null);
    }

    if (!this.props.expenses.length) {
      return React.createElement('span', null);
    }

    var totals = [];
    _.forEach(balances, function (amounts, payerKey) {
      var payerName = that.props._users[payerKey].name;
      _.forEach(amounts, function (amount, owerKey) {
        var owerName = that.props._users[owerKey].name;
        if (amount >= 0) return;
        totals.push(React.createElement(
          'li',
          { className: 'list-group-item' },
          payerName,
          ' owes $ ',
          -amount,
          ' to ',
          owerName
        ));
      });
    });
    return React.createElement(
      'div',
      { className: 'col-lg-4' },
      React.createElement(
        'div',
        { className: 'panel panel-info' },
        React.createElement(
          'div',
          { className: 'panel-heading' },
          'Summary'
        ),
        React.createElement(
          'ul',
          { className: 'list-group' },
          totals
        )
      )
    );
  }
});

var userIndex = 1;
var expenseIndex = 0;

React.render(React.createElement(ShareApp, null), document.getElementById('share-app'));