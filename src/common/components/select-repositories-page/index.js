import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchUserSnaps } from '../../actions/snaps';
import { fetchBuilds } from '../../actions/snap-builds';
import { fetchUserRepositories } from '../../actions/repositories';
import SelectRepositoryList from '../select-repository-list';
import { HeadingThree } from '../vanilla/heading';
import FirstTimeHeading from '../first-time-heading';
import { CardHighlighted } from '../vanilla/card';

class SelectRepositoriesPage extends Component {
  componentDidMount() {
    const { authenticated } = this.props.auth;
    const owner = this.props.user.login;

    if (authenticated) {
      // TODO Promise.all()
      this.props.dispatch(fetchUserRepositories());
      this.props.dispatch(fetchUserSnaps(owner));
    }

    this.fetchData(this.props);
  }

  fetchData(props) {
    const { snaps } = props;

    if (snaps.success) {
      snaps.snaps.forEach((snap) => {
        this.props.dispatch(fetchBuilds(snap.git_repository_url, snap.self_link));
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.snaps.success !== nextProps.snaps.success) {
      this.fetchData(nextProps);
    }
  }

  render() {
    // XXX this should fetch snaps and repos and pass to children ?
    const { snaps, snapBuilds } = this.props;
    return (
      <div>
        <FirstTimeHeading snaps={snaps} snapBuilds={snapBuilds} />
        <CardHighlighted>
          <HeadingThree>
            Choose repos to add
          </HeadingThree>
          <SelectRepositoryList/>
        </CardHighlighted>
      </div>
    );
  }
}

SelectRepositoriesPage.propTypes = {
  auth: PropTypes.object.isRequired,
  user: PropTypes.object,
  snaps: PropTypes.object.isRequired,
  snapBuilds: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const {
    auth,
    user,
    snaps,
    snapBuilds
  } = state;

  return {
    auth,
    user,
    snaps,
    snapBuilds
  };
}

export default connect(mapStateToProps)(SelectRepositoriesPage);
