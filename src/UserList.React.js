'use strict';

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

module.exports = UserList;
