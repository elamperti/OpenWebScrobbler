import React from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

class Pagination extends React.Component {
  state = {
    page: 1
  }

  navigateToPage = (page) => {
    this.setState({page}, () => {
      this.props.fetchLastfmProfileHistory(this.props.user, {page: this.state.page})
    })
  }

  nextPage = () => {
    const page = this.state.page + 1
    this.navigateToPage(page)
  }

  prevPage = () => {
    const page = this.state.page - 1
    this.navigateToPage(page)
  }

  render () {
    return (
      <div className="d-flex justify-content-between mr-4 ml-4">
        <Button  size="sm" onClick={this.prevPage} disabled={this.state.page <= 1}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Button size="sm" onClick={this.nextPage} disabled={this.state.page === this.props.totalPages}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    )
  }
}

export default Pagination
