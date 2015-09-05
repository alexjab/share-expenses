var AddExpenseForm = React.createClass ({
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

module.exports = AddExpenseForm;
