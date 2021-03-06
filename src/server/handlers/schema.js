import { schema } from 'normalizr';

export const owner = new schema.Entity('owners');

export const repo = new schema.Entity('repos', {
  owner: owner
}, {
  processStrategy: (entity) => {
    return {
      id: entity.id,
      fullName: entity.full_name,
      name: entity.name,
      owner: entity.owner,
      url: entity.html_url
    };
  }
});
export const repoList = new schema.Array(repo);

export const snap = new schema.Entity('snaps', {}, {
  idAttribute: 'name'
});
export const snapList = new schema.Array(snap);
