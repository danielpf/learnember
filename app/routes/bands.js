import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fetch from 'fetch';
import Song from 'rarwe/models/song';
import Band from 'rarwe/models/band';

export default class BandsRoute extends Route {
  @service('catalog') catalog;

  async model() {
    return this.catalog.fetchAll('bands');
  }
}
