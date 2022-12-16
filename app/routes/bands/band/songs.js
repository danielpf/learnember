import Route from '@ember/routing/route';
import { service } from '@ember/service';
import fetch from 'fetch';
import Song from 'rarwe/models/song';

export default class SongsRoute extends Route {
  @service catalog;

  async model() {
    const band = this.modelFor('bands.band');
    band.songs = this.catalog.fetchRelated(band, 'songs');
    return band;
  }

  resetController(controller) {
    controller.title = '';
    controller.showAddSong = true;
  }
}
