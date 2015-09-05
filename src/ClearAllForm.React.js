'use strict';

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

module.exports = ClearAllForm;
