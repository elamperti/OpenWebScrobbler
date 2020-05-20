import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Trans } from 'react-i18next';

class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.updatePage = this.updatePage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);

    this.state = {
      page: props.currentPage || 1,
    };
  }

  updatePage(page) {
    this.setState({ page }, () => {
      this.props.onPageChange(page);
    });
  }

  nextPage() {
    const page = this.state.page + 1;
    this.updatePage(page);
  }

  prevPage() {
    const page = this.state.page - 1;
    this.updatePage(page);
  }

  render() {
    return (
      <div className="d-flex justify-content-between m-2">
        <Button size="sm" onClick={this.prevPage} disabled={this.state.page <= 1}>
          <Trans i18nKey="previous">Previous</Trans>
        </Button>
        <Button size="sm" onClick={this.nextPage} disabled={this.state.page >= this.props.totalPages}>
          <Trans i18nKey="next">Next</Trans>
        </Button>
      </div>
    );
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
  onPageChange: () => {},
};

export default Pagination;
