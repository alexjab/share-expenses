'use strict';

var ShareApp = React.createClass({
  displayName: 'ShareApp',

  getInitialState: function getInitialState() {
    return {
      users: [],
      _users: {},
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
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(UserList, { users: this.state.users, onAddUser: this.handleAddUser }),
        React.createElement(ExpenseList, { users: this.state.users, _users: this.state._users, expenses: this.state.expenses }),
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
      key: index++
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
        'No expense yet.'
      );
    } else {
      var expenseList = this.props.expenses.map(function (expense) {
        return React.createElement(ExpenseItem, { users: that.props.users, _users: that.props._users, expense: expense });
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

  handleOnSubmit: function handleOnSubmit(e) {
    e.preventDefault();
    this.props.onAddExpense();
  },
  render: function render() {
    var userOptions = this.props.users.map(function (user) {
      return React.createElement(
        'option',
        { value: user.key },
        user.name
      );
    });
    var userCheckboxes = this.props.users.map(function (user) {
      return React.createElement(
        'div',
        { className: 'checkbox' },
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'checkbox' }),
          user.name
        )
      );
    });
    var addExpenseContent;
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
          React.createElement('input', { type: 'number', className: 'form-control', id: 'expense-amount', placeholder: 'Amount' })
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
            { className: 'form-control', id: 'expense-payer' },
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

  render: function render() {
    var expense = this.props.expense;
    var userName = this.props._users[expense.payer].name;
    var users = this.props.users.map(function (user) {
      return React.createElement(
        'div',
        { className: 'checkbox' },
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'checkbox' }),
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
      React.createElement('input', { type: 'text', className: 'form-control', defaultValue: expense.amount, placeholder: 'Amount' }),
      React.createElement('hr', null),
      React.createElement(
        'p',
        null,
        React.createElement(
          'b',
          null,
          'Paid by:'
        )
      ),
      React.createElement(
        'span',
        null,
        userName
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

  render: function render() {
    var that = this;
    if (!this.props.users.length) {
      return React.createElement('span', null);
    }

    if (!this.props.expenses.length) {
      return React.createElement('span', null);
    }

    var totalContents;
    var totals = [];
    this.props.users.forEach(function (ower) {
      that.props.users.forEach(function (owed) {
        totals.push(React.createElement(
          'li',
          { className: 'list-group-item' },
          ower.name,
          ' owes €X to ',
          owed.name
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

var index = 0;

React.render(React.createElement(ShareApp, null), document.getElementById('share-app'));