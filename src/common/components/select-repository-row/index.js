import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import styles from './selectRepositoryRow.css';

class SelectRepositoryRow extends Component {

  render() {
    const {
      errorMsg,
      repository,
      onChange,
      isEnabled
    } = this.props;

    const isChecked = repository.__isSelected;

    const rowClass = classNames({
      [styles.repositoryRow]: true,
      [styles.error]: errorMsg,
      [styles.repositoryEnabled]: isEnabled
    });

    return (
      <div className={ rowClass }>
        <input
          id={ repository.full_name }
          type="checkbox"
          checked={ isChecked || isEnabled }
          onChange={ onChange }
          disabled={ isEnabled }
        />
        <div>
          <label htmlFor={ repository.full_name }>{repository.full_name}</label>
        </div>
        { errorMsg &&
          <div className={ styles.errorMessage }>
            { errorMsg }
          </div>
        }
      </div>
    );
  }
}

SelectRepositoryRow.defaultProps = {
  __isSelected: false,
  isEnabled: false
};

SelectRepositoryRow.propTypes = {
  errorMsg: PropTypes.node,
  repository: PropTypes.shape({
    full_name: PropTypes.string.isRequired
  }).isRequired,
  isEnabled: PropTypes.bool,
  onChange: PropTypes.func,
  __isSelected: PropTypes.bool
};

export default SelectRepositoryRow;
