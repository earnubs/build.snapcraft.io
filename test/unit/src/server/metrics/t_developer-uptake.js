import expect from 'expect';
import promClient from 'prom-client';

import db from '../../../../../src/server/db';

describe('The developer uptake metric', () => {
  let updateDeveloperUptake;

  const testUsers = {
    0: {},
    1: {
      snaps_added: 1,
      snaps_removed: 1
    },
    2: {
      snaps_added: 2,
      snaps_removed: 1,
      names_registered: 1
    },
    3: {
      snaps_added: 1,
      names_registered: 1,
      builds_requested: 1
    }
  };

  beforeEach(async () => {
    // Must be required here rather than imported, to make sure that it
    // registers metrics when tests are run and clears them immediately
    // afterwards.
    updateDeveloperUptake = require('../../../../../src/server/metrics/developer-uptake').default;

    await db.model('GitHubUser').query('truncate').fetch();
  });

  afterEach(() => {
    promClient.register.clear();
  });

  xit('returns reasonable developer uptake values', () => {
    return db.transaction(async (trx) => {
      for (let i = 0; i < 4; i++) {
        await db.model('GitHubUser').forge({
          github_id: i,
          name: null,
          login: `person-${i}`,
          last_login_at: new Date()
        }).save(testUsers[i], { transacting: trx });
      }
      await updateDeveloperUptake(trx);
      const metricName = 'bsi_developer_uptake';
      expect(promClient.register.getSingleMetric(metricName).get()).toEqual({
        type: 'gauge',
        name: metricName,
        help: 'Number of developers who have reached various steps.',
        values: [
          {
            labels: { metric_type: 'kpi', step: 'enabled_repository' },
            value: 3
          },
          {
            labels: { metric_type: 'kpi', step: 'registered_name' },
            value: 2
          },
          {
            labels: { metric_type: 'kpi', step: 'requested_build' },
            value: 1
          }
        ]
      });
    });
  });
});
