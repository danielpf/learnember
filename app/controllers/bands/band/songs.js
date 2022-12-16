import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Song from 'rarwe/models/band';
import fetch from 'fetch';

export default class BandsBandSongsController extends Controller {
  @service('catalog') catalog;

  @tracked showAddSong = true;
  @tracked title = '';

  get hasNoTitle() {
    return !this.title;
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    this.catalog.create('songs', song, { rating });
  }

  @action
  async saveSong(event) {
    const song = await this.catalog.create(
      'songs',
      { title: this.title },
      {
        band: {
          data: {
            id: this.model.id,
            type: 'bands',
          },
        },
      }
    );
    this.model.songs = [...this.model.songs, song];
    this.title = '';
    this.showAddSong = true;
  }

  @action
  cancel(event) {
    this.showAddSong = true;
  }
}
