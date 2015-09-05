'use strict';

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

module.exports = ExpenseItem;
