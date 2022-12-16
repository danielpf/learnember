import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { isArray } from '@ember/array';
import fetch from 'fetch';
import Band from 'rarwe/models/band';
import Song from 'rarwe/models/song';

export default class CatalogService extends Service {
  storage = {};

  constructor() {
    super(...arguments);
    this.storage.bands = tracked([]);
    this.storage.songs = tracked([]);
  }

  add(type, record) {
    const collection =
      type === 'band' ? this.storage.bands : this.storage.songs;
    const recordIds = collection.map((record) => record.id);
    if (!recordIds.includes(record.id)) {
      collection.push(record);
    }
  }

  get bands() {
    return this.storage.bands;
  }

  get songs() {
    return this.storage.songs;
  }

  find(type, filterFn) {
    let collection = type === 'band' ? this.storage.bands : this.storage.songs;
    return collection.find(filterFn);
  }

  load(json) {
    return this._loadResource(json.data);
  }

  async create(type, attributes, relationships = {}) {
    const payload = { data: { type, attributes, relationships } };
    let resp = await fetch(`/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
    const json = await resp.json();
    return this.load(json);
  }

  async update(type, record, attributes) {
    const prefix = type === 'band' ? 'bands' : 'songs';
    const payload = {
      data: {
        id: record.id,
        type: prefix,
        attributes,
      },
    };
    const resp = await fetch(`/${prefix}/${record.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(payload),
    });
    const json = await resp.json();
    return this.load(json);
  }

  async fetchRelated(record, relationship) {
    const url = record.relationships[relationship];
    const response = await fetch(url);
    const json = await response.json();
    if (isArray(json.data)) {
      record[relationship] = this.loadAll(json);
    } else {
      record[relationship] = this.load(json);
    }
    return record[relationship];
  }

  async fetchAll(type) {
    const resp = await fetch(`/${type}`);
    const json = await resp.json();
    this.loadAll(json);
    if (type === 'bands') {
      return this.bands;
    } else if (type === 'songs') {
      return this.songs;
    }
    throw new Error();
  }

  loadAll(json) {
    const records = [];
    for (const item of json.data) {
      records.push(this._loadResource(item));
    }
    return records;
  }

  _loadResource(data) {
    const { id, type, attributes, relationships } = data;
    let record;
    const rels = extractRelationships(relationships);
    if (type === 'bands') {
      record = new Band({ id, ...attributes }, rels);
      this.add('band', record);
    } else if (type === 'songs') {
      record = new Song({ id, ...attributes }, rels);
      this.add('song', record);
    }
    return record;
  }
}

function extractRelationships(rels) {
  const relationships = {};
  for (const relationshipName in rels) {
    relationships[relationshipName] = rels[relationshipName].links.related;
  }
  return relationships;
}
