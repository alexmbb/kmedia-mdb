import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Label } from 'semantic-ui-react';

import { createDate } from '../../../helpers/date';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import DailyLessonPlaceholder from '../../../images/hp_lesson_temp.jpg';

class LatestDailyLesson extends Component {
  static propTypes = {
    collection: shapes.LessonCollection.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { t, collection } = this.props;

    return (
      <div className="thumbnail">
        <Link to="/lessons/latest">
          <Image fluid src={DailyLessonPlaceholder} className="thumbnail__image" width={512} />
          <Header as="h2" className="thumbnail__header">
            <Header.Content>
              <Header.Subheader>
                {t('values.date', { date: createDate(collection.film_date) })}
              </Header.Subheader>
              {t('home.last-lesson')}
            </Header.Content>
          </Header>
          <Label color="orange" >
            {t('nav.sidebar.lessons')}
          </Label>
        </Link>
      </div>
    );
  }
}

export default LatestDailyLesson;
