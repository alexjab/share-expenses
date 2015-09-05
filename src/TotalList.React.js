'use strict';

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
              <b>{payerName}</b> owes <b>${-amount.toFixed (2)}</b> to <b>{owerName}</b>
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

module.exports = TotalList;
