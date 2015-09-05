var AddUserForm = React.createClass ({
  handleSubmit: function (e) {
    e.preventDefault ();

    var newUserName = React.findDOMNode(this.refs.newUserName).value.trim();
    if (!newUserName) return;
    React.findDOMNode(this.refs.newUserName).value = '';

    var newUser = {
      name: newUserName,
      key: window.userIndex++
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

module.exports = AddUserForm;
