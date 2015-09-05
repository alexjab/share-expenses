'use strict';

var ExpenseItem = require ('./ExpenseItem.React.js');

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

module.exports = ExpenseList;
